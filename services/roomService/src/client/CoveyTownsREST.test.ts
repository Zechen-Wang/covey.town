import assert from 'assert';
import CORS from 'cors';
import Express from 'express';
import http from 'http';
import { nanoid } from 'nanoid';
import { AddressInfo } from 'net';
import addTownRoutes from '../router/towns';
import TownsServiceClient, { TownListResponse } from './TownsServiceClient';

import { connect, disconnect } from '../database';

type TestTownData = {
  friendlyName: string;
  coveyTownID: string;
  isPubliclyListed: boolean;
  townUpdatePassword: string;
};

function expectTownListMatches(towns: TownListResponse, town: TestTownData) {
  const matching = towns.towns.find(townInfo => townInfo.coveyTownID === town.coveyTownID);
  if (town.isPubliclyListed) {
    expect(matching).toBeDefined();
    assert(matching);
    expect(matching.friendlyName).toBe(town.friendlyName);
  } else {
    expect(matching).toBeUndefined();
  }
}

describe('TownsServiceAPIREST', () => {
  let server: http.Server;
  let apiClient: TownsServiceClient;

  async function createTownForTesting(
    friendlyNameToUse?: string,
    isPublic = false,
  ): Promise<TestTownData> {
    const friendlyName =
      friendlyNameToUse !== undefined
        ? friendlyNameToUse
        : `${isPublic ? 'Public' : 'Private'}TestingTown=${nanoid()}`;
    const ret = await apiClient.createTown({
      friendlyName,
      isPubliclyListed: isPublic,
      creatorName: 'test',
    });
    return {
      friendlyName,
      isPubliclyListed: isPublic,
      coveyTownID: ret.coveyTownID,
      townUpdatePassword: ret.coveyTownPassword,
    };
  }

  beforeAll(async () => {
    const app = Express();
    app.use(CORS());
    server = http.createServer(app);

    addTownRoutes(server, app);
    connect(); // make connection to mongodb
    await server.listen();
    const address = server.address() as AddressInfo;
    jest.setTimeout(30000);
    apiClient = new TownsServiceClient(`http://127.0.0.1:${address.port}`);
  });
  afterAll(async () => {
    await server.close();
    disconnect();
  });
  describe('CoveyTownCreateAPI', () => {
    it('Allows for multiple towns with the same friendlyName', async () => {
      const firstTown = await createTownForTesting();
      const secondTown = await createTownForTesting(firstTown.friendlyName);
      expect(firstTown.coveyTownID).not.toBe(secondTown.coveyTownID);
    });
    it('Prohibits a blank friendlyName', async () => {
      try {
        await createTownForTesting('');
        fail('createTown should throw an error if friendly name is empty string');
      } catch (err) {
        // OK
        expect(err.message).toBe('Error processing request: FriendlyName must be specified');
      }
    });
  });

  describe('CoveyTownListAPI', () => {
    it('Lists public towns, but not private towns', async () => {
      const pubTown1 = await createTownForTesting(undefined, true);
      const privTown1 = await createTownForTesting(undefined, false);
      const pubTown2 = await createTownForTesting(undefined, true);
      const privTown2 = await createTownForTesting(undefined, false);

      const towns = await apiClient.listTowns();
      expectTownListMatches(towns, pubTown1);
      expectTownListMatches(towns, pubTown2);
      expectTownListMatches(towns, privTown1);
      expectTownListMatches(towns, privTown2);
    });
    it('Allows for multiple towns with the same friendlyName', async () => {
      const pubTown1 = await createTownForTesting(undefined, true);
      const privTown1 = await createTownForTesting(pubTown1.friendlyName, false);
      const pubTown2 = await createTownForTesting(pubTown1.friendlyName, true);
      const privTown2 = await createTownForTesting(pubTown1.friendlyName, false);

      const towns = await apiClient.listTowns();
      expectTownListMatches(towns, pubTown1);
      expectTownListMatches(towns, pubTown2);
      expectTownListMatches(towns, privTown1);
      expectTownListMatches(towns, privTown2);
    });
  });

  describe('CoveyTownDeleteAPI', () => {
    it('Throws an error if the password is invalid', async () => {
      const { coveyTownID } = await createTownForTesting(undefined, true);
      try {
        await apiClient.deleteTown({
          coveyTownID,
          coveyTownPassword: nanoid(),
        });
        fail('Expected deleteTown to throw an error');
      } catch (err) {
        // Expected error
        expect(err.message)
          .toBe('Error processing request: Invalid password. ' +
            'Please double check your town update password.');
      }
    });
    it('Throws an error if the townID is invalid', async () => {
      const { townUpdatePassword } = await createTownForTesting(undefined, true);
      try {
        await apiClient.deleteTown({
          coveyTownID: nanoid(),
          coveyTownPassword: townUpdatePassword,
        });
        fail('Expected deleteTown to throw an error');
      } catch (err) {
        // Expected error
        expect(err.message).toBe('Error processing request: Invalid password. ' +
          'Please double check your town update password.');
      }
    });
    it('Deletes a town if given a valid password and town, no longer allowing it to be joined or listed', async () => {
      const { coveyTownID, townUpdatePassword } = await createTownForTesting(undefined, true);
      await apiClient.deleteTown({
        coveyTownID,
        coveyTownPassword: townUpdatePassword,
      });
      try {
        await apiClient.joinTown({
          userName: nanoid(),
          coveyTownID,
        });
        fail('Expected joinTown to throw an error');
      } catch (err) {
        // Expected
        expect(err.message).toBe('Error processing request: Error: No such town');
      }
      const listedTowns = await apiClient.listTowns();
      if (listedTowns.towns.find(r => r.coveyTownID === coveyTownID)) {
        fail('Expected the deleted town to no longer be listed');
      }
    });
  });
  describe('CoveyTownUpdateAPI', () => {
    it('Checks the password before updating any values', async () => {
      const pubTown1 = await createTownForTesting(undefined, true);
      expectTownListMatches(await apiClient.listTowns(), pubTown1);
      try {
        await apiClient.updateTown({
          coveyTownID: pubTown1.coveyTownID,
          coveyTownPassword: `${pubTown1.townUpdatePassword}*`,
          friendlyName: 'broken',
          isPubliclyListed: false,
        });
        fail('updateTown with an invalid password should throw an error');
      } catch (err) {
        // err expected
        // TODO this should really check to make sure it's the *right* error, but we didn't specify
        // the format of the exception :(
        expect(err.message).toBe('Error processing request: ' +
          'Invalid password or update values specified. ' +
          'Please double check your town update password.');
      }

      // Make sure name or vis didn't change
      expectTownListMatches(await apiClient.listTowns(), pubTown1);
    });
    it('Updates the friendlyName and visbility as requested', async () => {
      const pubTown1 = await createTownForTesting(undefined, false);
      expectTownListMatches(await apiClient.listTowns(), pubTown1);
      await apiClient.updateTown({
        coveyTownID: pubTown1.coveyTownID,
        coveyTownPassword: pubTown1.townUpdatePassword,
        friendlyName: 'newName',
        isPubliclyListed: true,
      });
      pubTown1.friendlyName = 'newName';
      pubTown1.isPubliclyListed = true;
      expectTownListMatches(await apiClient.listTowns(), pubTown1);
    });
    it('Does not update the visibility if visibility is undefined', async () => {
      const pubTown1 = await createTownForTesting(undefined, true);
      expectTownListMatches(await apiClient.listTowns(), pubTown1);
      await apiClient.updateTown({
        coveyTownID: pubTown1.coveyTownID,
        coveyTownPassword: pubTown1.townUpdatePassword,
        friendlyName: 'newName2',
      });
      pubTown1.friendlyName = 'newName2';
      expectTownListMatches(await apiClient.listTowns(), pubTown1);
    });
  });

  describe('CoveyMemberAPI', () => {
    it('Throws an error if the town does not exist', async () => {
      await createTownForTesting(undefined, true);
      try {
        await apiClient.joinTown({
          userName: nanoid(),
          coveyTownID: nanoid(),
        });
        fail('Expected an error to be thrown by joinTown but none thrown');
      } catch (err) {
        // OK, expected an error
        // TODO this should really check to make sure it's the *right* error, but we didn't specify
        // the format of the exception :(
        expect(err.message).toBe('Error processing request: Error: No such town');
      }
    });
    it('Admits a user to a valid public or private town', async () => {
      const pubTown1 = await createTownForTesting(undefined, true);
      const privTown1 = await createTownForTesting(undefined, false);
      const res = await apiClient.joinTown({
        userName: nanoid(),
        coveyTownID: pubTown1.coveyTownID,
      });
      expect(res.coveySessionToken).toBeDefined();
      expect(res.coveyUserID).toBeDefined();

      const res2 = await apiClient.joinTown({
        userName: nanoid(),
        coveyTownID: privTown1.coveyTownID,
      });
      expect(res2.coveySessionToken).toBeDefined();
      expect(res2.coveyUserID).toBeDefined();
    });
  });

  describe('List single town', () => {
    it('Allows listing single town', async () => {
      const friendlyName = nanoid();
      const creatorName = nanoid();
      const res = await apiClient.createTown({ friendlyName, isPubliclyListed: true, creatorName });
      const retTown = await apiClient.listSingleTown({ coveyTownID: res.coveyTownID });
      expect(retTown.creator).toBe(creatorName);
      expect(retTown.admins.length).toEqual(0);
      expect(retTown.blockers.length).toEqual(0);
    });
  });

  describe('Add blockers', () => {
    it('Allows adding blockers in town', async () => {
      const friendlyName = nanoid();
      const blockerName = nanoid();
      const res = await apiClient.createTown({ friendlyName, isPubliclyListed: true, creatorName: nanoid() });
      await apiClient.addBlocker({ blockerName, coveyTownID: res.coveyTownID });
      const retTown = await apiClient.listSingleTown({ coveyTownID: res.coveyTownID });
      expect(retTown.blockers).toContain(blockerName);
    });
    it('Expected an error to be thrown by providing incorrect town id', async () => {
      await expect(apiClient.addBlocker({ blockerName: nanoid(), coveyTownID: nanoid() })).rejects.toThrowError();
    });
  });

  describe('Add admins', () => {
    it('Allows adding admins in town', async () => {
      const friendlyName = nanoid();
      const adminName = nanoid();
      const res = await apiClient.createTown({ friendlyName, isPubliclyListed: true, creatorName: nanoid() });
      await apiClient.addAdmin({ AdminName: adminName, coveyTownID: res.coveyTownID });
      const retTown = await apiClient.listSingleTown({ coveyTownID: res.coveyTownID });
      expect(retTown.admins).toContain(adminName);
    });
    it('Expected an error to be thrown by providing incorrect town id', async () => {
      await expect(apiClient.addAdmin({ AdminName: nanoid(), coveyTownID: nanoid() })).rejects.toThrowError();
    });
  });

  describe('Delete admins', () => {
    it('Allows deleting admins in town', async () => {
      const friendlyName = nanoid();
      const adminName = nanoid();
      const res = await apiClient.createTown({ friendlyName, isPubliclyListed: true, creatorName: nanoid() });
      await apiClient.addAdmin({ AdminName: adminName, coveyTownID: res.coveyTownID });
      let retTown = await apiClient.listSingleTown({ coveyTownID: res.coveyTownID });
      expect(retTown.admins).toContain(adminName);
      await apiClient.deleteAdminByTownId({ adminName, coveyTownID: res.coveyTownID });
      retTown = await apiClient.listSingleTown({ coveyTownID: res.coveyTownID });
      expect(retTown.admins).not.toContain(adminName);
    });
    it('Expected an error to be thrown by providing incorrect town id', async () => {
      await expect(apiClient.deleteAdminByTownId({ adminName: nanoid(), coveyTownID: nanoid() })).rejects.toThrowError();
    });
  });

  describe('Delete blockers', () => {
    it('Allows deleting blockers in town', async () => {
      const friendlyName = nanoid();
      const blockerName = nanoid();
      const res = await apiClient.createTown({ friendlyName, isPubliclyListed: true, creatorName: nanoid() });
      await apiClient.addBlocker({ blockerName, coveyTownID: res.coveyTownID });
      let retTown = await apiClient.listSingleTown({ coveyTownID: res.coveyTownID });
      expect(retTown.blockers).toContain(blockerName);
      await apiClient.deleteBlockerByTownId({ blockerName, coveyTownID: res.coveyTownID });
      retTown = await apiClient.listSingleTown({ coveyTownID: res.coveyTownID });
      expect(retTown.blockers).not.toContain(blockerName);
    });
    it('Expected an error to be thrown by providing incorrect town id', async () => {
      await expect(apiClient.deleteBlockerByTownId({ blockerName: nanoid(), coveyTownID: nanoid() })).rejects.toThrowError();
    });
  });

});
