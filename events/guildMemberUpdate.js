const Discord = require('discord.js');

Array.prototype.diff = function(a) { // Not seeming to work with discord.js objects as the "ref diff isn't a function"
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

module.exports = (client, oldMember, newMember) => {
    client.guildDB.ensure(newMember.guild.id, client.guildDBDefaults);
    var logChannelId = client.guildDB.get(newMember.guild.id, "logChannel");
    if(logChannelId) {
        logServer = newMember.guild.channels.get(logChannelId);
        if(logServer) {
            if(oldMember.roles.array().length !== newMember.roles.array().length) { //check if the roles changed
                var addorremoved = "Role Added";
                if (oldMember.roles.array().length > newMember.roles.array().length) { //role removed
                    addorremoved = "Role Removed";
                }
                var roles = newMember.roles.filter(function(i) {return oldMember.roles.array().indexOf(i) < 0;});
                //var roles = newMember.roles.diff(oldMember.roles);
                console.log(roles.values()[0]); //TODO: Something is broken in here and i'm not sure what
                var role = newMember.guild.roles.get(roles.first());
                console.log(role);
                const embed = new Discord.MessageEmbed()
                    .setAuthor(addorremoved)
                    .setColor(client.config.embedcolor)
                    .addField(newMember.user.tag, `(${newMember.id})`)
                    .addField("Role", `${roles.name} (${roles.id})`)
                    .setFooter(new Date().toUTCString());
                logServer.send({embed});

            } else if (oldMember.nickname !== newMember.nickname) { // check for nickname change
                var oldn = "**No Nickname**";
                var newn = "**No Nickname**";
                var namec = "Nickname Changed";
                if(oldMember.nickname !== null) {
                    namec = "Nickname Added";
                    oldn = oldMember.nickname;
                }
                if (newMember.nickname !== null) {
                    namec = "Nickname Removed";
                    newn = newMember.nickname;
                }
                const embed = new Discord.MessageEmbed()
                    .setAuthor(namec)
                    .setColor(client.config.embedcolor)
                    .addField(newMember.user.tag, `(${newMember.id})`)
                    .addField("Old: ", oldn)
                    .addField("New: ", newn)
                    .setFooter(new Date().toUTCString());
                logServer.send({embed});
            } else { // idk what changed, log for debugging
                const embed = new Discord.MessageEmbed()
                    .setAuthor("Something changed for this user but I'm not sure what.")
                    .setColor(client.config.embedcolor)
                    .addField(newMember.user.tag, `(${newMember.id})`)
                    .setFooter(new Date().toUTCString());
                logServer.send({embed});
            }
        }
    }
}