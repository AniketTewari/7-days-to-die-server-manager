module.exports = {

    friendlyName: 'Disable economy',

    description: '',

    inputs: {
        serverId: {
            type: 'number',
            required: true
        }
    },

    exits: {
        success: {
        },
    },


    fn: async function (inputs, exits) {

        try {
            await SdtdConfig.update({server: inputs.serverId}, {economyEnabled: false});
            return exits.success();
        } catch (error) {
            sails.log.error(`API - Sdtdserver:disable-economy - ${error}`);
            return exits.error(error);
        }

    }
};
