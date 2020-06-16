const functions = require('firebase-functions');
const admin = require('firebase-admin');

const { createPlaylist } = require('./utils');

admin.initializeApp();

exports.createPlaylist = functions.firestore
  .document('playlists/{id}')
  .onCreate(async (snapShot, context) => {
    const resp = await createPlaylist(snapShot.data());

    return admin
      .firestore()
      .collection('playlists')
      .doc(context.params.id)
      .update(resp);
  });
