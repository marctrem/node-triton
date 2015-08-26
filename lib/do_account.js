/*
 * Copyright 2015 Joyent Inc.
 *
 * `triton account ...`
 */

var common = require('./common');

function do_account(subcmd, opts, args, callback) {
    if (opts.help) {
        this.do_help('help', {}, [subcmd], callback);
        return;
    } else if (args.length !== 0) {
        callback(new Error('invalid args: ' + args));
        return;
    }

    this.triton.cloudapi.getAccount(function (err, account) {
        if (err) {
            callback(err);
            return;
        }

        if (opts.json) {
            console.log(JSON.stringify(account));
        } else {
            // pretty print
            var dates = ['updated', 'created'];
            Object.keys(account).forEach(function (key) {
                var val = account[key];
                if (dates.indexOf(key) >= 0) {
                    console.log('%s: %s (%s)', key, val,
                        common.longAgo(new Date(val)));
                } else {
                    console.log('%s: %s', key, val);
                }
            });
        }
        callback();
    });
}

do_account.options = [
    {
        names: ['help', 'h'],
        type: 'bool',
        help: 'Show this help.'
    },
    {
        names: ['json', 'j'],
        type: 'bool',
        help: 'JSON output.'
    }
];
do_account.help = (
    'Show account information\n'
    + '\n'
    + 'Usage:\n'
    + '     {{name}} account\n'
    + '\n'
    + '{{options}}'
);

do_account.aliases = ['whoami'];

module.exports = do_account;