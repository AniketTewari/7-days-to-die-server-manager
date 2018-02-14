module.exports = {

  friendlyName: 'Set discord chat channel',

  description: 'Set the chatChannelId for a SdtdServer',

  inputs: {
    serverId: {
      required: true,
      type: 'string'
    },
    chatChannelId: {
      required: true,
      type: 'string'
    },
    richMessages: {
      required: true,
      type: 'boolean'
    }
  },

  exits: {
    success: {},
    badChannel: {
      responseType: 'badRequest'
    },
    notFound: {
      responseType: 'notFound'
    }
  },


  fn: async function (inputs, exits) {

    try {
      let server = await SdtdServer.findOne(inputs.serverId);
      let discordClient = sails.hooks.discordbot.getClient();
      let chatChannel = discordClient.channels.get(inputs.chatChannelId);
      let chatBridgeHook = sails.hooks.discordchatbridge

      if (_.isUndefined(server)) {
        return exits.notFound()
      }

      if (_.isUndefined(chatChannel) && inputs.chatChannelId) {
        return exits.badChannel();
      }

      await SdtdConfig.update({
        server: inputs.serverId
      }, {
        chatChannelId: inputs.chatChannelId,
        chatChannelRichMessages: inputs.richMessages
      })

      if (chatBridgeHook.getStatus(inputs.serverId)) {
        chatBridgeHook.stop(inputs.serverId);
        chatBridgeHook.start(inputs.serverId);
      } else {
        chatBridgeHook.start(inputs.serverId)
      }

      sails.log.debug(`API - SdtdServer:set-chat-channel - set chat channel ${inputs.chatChannelId} for server ${inputs.serverId}`);
      return exits.success();
    } catch (error) {
      sails.log.error(`API - SdtdServer:set-chat-channel - ${error}`);
      return exits.error(error);
    }
  }
};
