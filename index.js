
// todas las funciones se han simplificado lo más posible si encuentra un error / error tipográfico por escrito, hágamelo saber en el problema


// conectando a WhatsApp web usando Baileys https://www.github.com/adiwajshing/baileys
const {
  WAConnection: _WAConnection,
  MessageType,
  Presence,
  MessageOptions,
  Mimetype,
  MimetypeMap,
  WALocationMessage,
  ChatModification,
  WA_MESSAGE_STUB_TYPES,
  WA_DEFAULT_EPHEMERAL,
  ReconnectMode,
  ProxyAgent,
  GroupSettingChange,
  waChatKey,
  mentionedJid,
  processTime
} = require("@adiwajshing/baileys");

// functions node modules
const speed = require('performance-now');
const moment = require("moment-timezone");
const { spawn, exec, execSync } = require("child_process");
let path = require('path');
const translate = require('@iamtraction/google-translate');
const ffmpeg = require("fluent-ffmpeg");
const toMs = require('ms');
const fs = require("fs");
const similarity = require('similarity');
const threshold = 0.72;
const lxa = require('./result/index');
const package = require('./package.json');
//-- library
const simple = require('./whatsapp/connecting');
const { color, bgcolor } = require('./library/color');
const { 
  getBuffer,
  createExif,
  modStick,
  h2k, 
  isUrl,
  pickRandom,
  generateMessageID, 
  getGroupAdmins,
  getRandom,
  kyun,
  weton,
  week,
  date,
  waktu,
  tanggal,
  time,
  WIB,
  WITA,
  WIT,
  ucapanWaktu,
} = require('./library/functions');

// funciones 

const {
  direc,
  addImage,
  addVideo,
  addStiker,
  addAudio
} = require('./functions/directory');


const { 
  User, 
  cekRegis,
  addRegister,
  addUser, 
  cekUser,
  cekPoin, 
  addPoin, 
  addLevel,
  cekLevel,
  cekBanned, 
  addBanned, 
  delBanned,
  cekPremium,
  addPremium,
  delPremium,
  addAfk,
  delAfk,
  cekAfk,
  cekAfkReason,
  cekAfkTime,
  addWarn,
  delWarn,
  cekWarn,
  addBahasa,
  cekBahasa
} = require('./functions/user'); // cambiar y recuperar datos de usuario en ./database/user

const {
  Group,
  addGroup,
  addOffline,
  delOffline,
  cekOffline,
  addWelcome,
  delWelcome,
  cekWelcome,
  addAntilink,
  delAntilink,
  cekAntilink,
  addBadword,
  delBadword,
  cekBadword,
  addAntidelete,
  delAntidelete,
  cekAntidelete,
  addDetect,
  delDetect,
  cekDetect
} = require('./functions/group'); // cambiar y recuperar datos en ./database/group

const {
  st,
  addName,
  addAuthor,
  addPackname,
  addWm,
  addGamewaktu,
  addPoingame,
  addCmd
} = require('./functions/setting-bot'); // cambiar datos en ./database/setting-bot
const { msgFilter } = require('./functions/antispam')
const { menu } = require('./functions/menu'); 
const { espa, ind, eng, } = require('./language/index');

// funciones de  ./functions/setting-bot
let ownerNumber = st.ownerNumber; // número de propietario
let prefix = st.prefix; // prefijo
let listprefix = st.listprefix; // lista de  prefiijos
let isPoingame = st.poinGame; 
let isGametime = st.gameTime; 
let isPoindefect = st.poinDefect; 
let isNama = st.nama; // nombre del bot
let isAuthor = st.author; // El autor se utiliza en la función de Stickers
let isPackname = st.packname; // El nombre del paquete se utiliza en la función de Stickers
let isWm = st.wm; // wm se usa para la descripción en el botón de mensaje
let isTotalcmd = st.totalcommand; // información sobre el número de comandos utilizados por los usuarios

// -- thumbnail
let thumb = fs.readFileSync('./temp/fg.jpg'); 

let fakethumb = fs.readFileSync('./temp/fake.jpg'); 

let baterai = {
    baterai: 0,
    cas: false
};

module.exports = Fg = async (Fg, mek) => {
  try {
    if (!mek.hasNewMessage) return;
    mek = mek.messages.all()[0];
    if (!mek.message) return;
    if(mek.key.fromMe) return; // elimínelo para los usuarios de bots propios, pero habrá errores en las funciones del juego
    if (mek.key && mek.key.remoteJid == 'status@broadcast') return;
    mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
    let m = simple.smsg(Fg, mek);
    global.prefix;
    global.blocked;
    const content = JSON.stringify(mek.message);
    const from = mek.key.remoteJid;
    const type = Object.keys(mek.message)[0];
    const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType;
    const { wa_version, mcc, mnc, os_version, device_manufacturer, device_model } = Fg.user.phone;
//--
    let body =
      type === "conversation" && mek.message.conversation
        ? mek.message.conversation
        : type == "imageMessage" && mek.message.imageMessage.caption
        ? mek.message.imageMessage.caption
        : type == "videoMessage" && mek.message.videoMessage.caption
        ? mek.message.videoMessage.caption
        : type == "extendedTextMessage" && mek.message.extendedTextMessage.text
        ? mek.message.extendedTextMessage.text
        : (type == 'listResponseMessage') && mek.message[type].singleSelectReply.selectedRowId 
       ? mek.message[type].singleSelectReply.selectedRowId 
        : type == "buttonsResponseMessage" && mek.message[type].selectedButtonId
        ? mek.message[type].selectedButtonId
        : '';
      for(var v of listprefix){
			if(body.startsWith(v)){
			  prefix = v ;
			}
      }
     const budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : '';
     const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
     const args = body.trim().split(/ +/).slice(1);
     const more = String.fromCharCode(8206);
     const readMore = more.repeat(4000);
     const value = args.join(' ');
     const isCmd = body.startsWith(prefix);
     const totalchat = await Fg.chats.all();
     const botNumber = Fg.user.jid;
     
//-- Grupo Metadata
     const isGroup = from.endsWith('@g.us');
     const sender = isGroup ? mek.participant : mek.key.remoteJid;
     const groupMetadata = isGroup ? await Fg.groupMetadata(from) : '';
     const groupName = isGroup ? groupMetadata.subject : '';
     const groupId = isGroup ? groupMetadata.jid : '';
     const groupMembers = isGroup ? groupMetadata.participants : '';
     const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : '';
     const isOwner = ownerNumber.includes(sender) || false;
     const isBotAdmins = groupAdmins.includes(botNumber) || false;
     const isAdmins = groupAdmins.includes(sender) || false;
     let conts = mek.key.fromMe ? Fg.user.jid : Fg.contacts[sender] || { notify: jid.replace(/@.+/, '') };
     const pushname = mek.key.fromMe ? Fg.user.name : conts.name || conts.vname || conts.notify || '-';
     let siapa = mek.quoted ? mek.quoted.sender : mek.mentionedJid && mek.mentionedJid[0] ? mek.mentionedJid[0] : mek.fromMe ? Fg.user.jid : mek.sender;
     let dia = mek.quoted ? mek.quoted.sender : mek.mentionedJid && mek.mentionedJid[0] ? mek.mentionedJid[0] : false;

//--- comprobar la información del usuario
     let isPoin = cekPoin(sender);
     let isLevel = cekLevel(sender);
     let isPremium = cekPremium(sender);
     let isBanned = cekBanned(sender);
     let isAfk = cekAfk(sender);
     let isAfkTime = cekAfkTime(sender);
     let isAfkReason = cekAfkReason(sender);
     let isOffline = cekOffline(from);
     let isWelcome = cekWelcome(from);
     let isAntidelete = cekAntidelete(from);
     let isAntilink = cekAntilink(from);
     let isDetect = cekDetect(from);
     let isRegister = cekRegis(sender);
     let msg = cekBahasa(sender);
     
          // -- Idioma 
     if (msg === "español") {
       msg = espa;
     } else if (msg === "english") {
       msg = eng;
     } else if (msg === "indonesia") {
       msg = ind;
     } else {
       msg = espa;
     }
     
     // funciones de mención de usuario premium
     if (isPremium) {
       prem = "Si";
     } else {
       prem = "No";
     }
     
// -- bateria
Fg.on('CB:action,,battery', json => {
	const a = json[2][0][1].value;
	const b = json[2][0][1].live;
	baterai.baterai = a;
	baterai.cas = b;
});
     
// detect quoted 
     const isMedia = type === "imageMessage" || type === "videoMessage";
     const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage');
 	 	 const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage');
		 const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage');
		 const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage');
		 const isQuotedDocument = type === 'extendedTextMessage' && content.includes('documentMessage');
	   const isQuotedLocation = type === 'extendedTextMessage' && content.includes('locationMessage');
		 const isQuotedextendedText = type === 'extendedTextMessage' && content.includes('extendedTextMessage');


// comando de registro de la consola cuando está en un chat privado
    if (!isGroup && isCmd) {
      console.log("‣", bgcolor('Cmd en CHAT PRIVADO', 'magenta'));
      console.log(" From :", color(pushname, "yellow"), "Tanggal :", bgcolor(tanggal, 'grey'));
      console.log(" Command :", color(command.toUpperCase(), "orange"), "MessageType :", bgcolor(type, "orange"));
    }
    
// comando de registro de la consola cuando está en el grupo
    if (isGroup && isCmd) {
      console.log("‣", bgcolor('Cmd en', 'magenta'), "Grupo", color(groupName, "aqua"));
      console.log(" De:", color(pushname, "yellow"), "Fecha :", bgcolor(tanggal, 'grey'));
      console.log(" Cmd :", color(command.toUpperCase(), "blue"), "MessageType :", bgcolor(type, "orange"));
    }
  
// mensaje de registro de la consola sin comando
    if (!isCmd && !mek.key.fromMe && !mek.isBaileys) {
      console.log("‣", bgcolor('Message','magenta'));
      console.log(" De :", color(pushname, "yellow"), "Fecha :", bgcolor(tanggal, 'grey'));
      console.log(" Mensaje :", color(budy, "orange"), "MessageType :", bgcolor(type, "orange"));
    }

// Anti spam que se suma al spam :v
    if (isCmd && msgFilter.isFiltered(from)) {
         return m.reply('⚠️ no spam')
					}
    if (isCmd && !isOwner) msgFilter.addFilter(from)


if (budy) addUser(sender); // agregar información de usuario a la base de datos
if (budy) addGroup(from); // agregar información de grupo a la base de datos
if (isCmd) addCmd() // aumentar el número total de comandos cuando el usuario usa el comando
if (isCmd) addPoin(sender); // agregar puntos de usuario al usar comandos

// suma puntos al nivel y acumula para subir de nivel
const Amount = isPoindefect * (Math.pow(2, isLevel) - 1)
if (Amount <= isPoin) {
           await addLevel(sender) // puntos acumulados para subir de nivel
          }

// comando especial cuando el estado fuera de línea  está activado en el grupo
switch (command) {
  
  case 'offline': // escribe  offline el bot no responderá a ningún comando en ciertos grupos
    if(!isGroup) return m.reply(msg.group)
    if(!isAdmins && !isOwner) return m.reply(msg.admin)
    if (isOffline === true ) {
      return m.reply('✅ Bot offline')
    }
    await addOffline(from)
    m.reply(msg.offline)
    break

  case 'online':
    if(!isGroup) return m.reply(msg.group)
    if(!isAdmins && !isOwner) return m.reply(msg.admin)
    if (isOffline === false ) {
      return m.reply('✅ Bot online')
    }
    await delOffline(from)
    m.reply(msg.online)
    break 
    default:
}


if (isGroup && isOffline === true) return; 
if (isBanned) return; // los usuarios con estado baneado no podrán usar el comando

switch (command) { 
 
  case 'restart': 
    if(!isOwner) return m.reply(msg.owner)
    m.reply('Reiniciando bot')
try {
  process.send('reset')
} catch (e) {
  m.reply('...')
}
  break
 
  case 'ping':
    const timestamp = speed();
    const latensi = speed() - timestamp 
    m.reply(`🟢 *Velocidad* : ${latensi.toFixed(3)} _Segundos_`)
  break 
  

  default:
  
    if (budy.startsWith('$')){
      if (!mek.key.fromMe && !isOwner) return;
      qur = budy.slice(2);
      exec(qur, (err, stdout) => {
        if (err) return m.reply(`‣  ${err}`);
        if (stdout) {
          m.reply(stdout);
          }
          });
          }
          
    if (budy.startsWith('>')){
      if (!mek.key.fromMe && !isOwner) return;
      try {
        Fg.sendMessage(from, "‣ "+JSON.stringify(eval(budy.slice(2)),null,'\t'), text, {quoted: mek});
        } catch(err) {
          e = String(err);
          m.reply("‣ "+e); }}} 
          
          //---
    let isLink = 'https://chat.whatsapp.com/'
    if(budy.match(isLink) && isAntilink === true ) {
      if(isAdmins) return
      if(!isBotAdmins) return
      code = await Fg.groupInviteCode(from) 
      if(budy.match(isLink+code)) {
        return !0
      } else {
        m.reply(msg.antilink)
        await addWarn(sender)
        m.reply(msg.addwarn)
        cek = await cekWarn(sender)
        if(cek === 3) {
          await Fg.groupRemove(from, sender)
          await delWarn(sender, 3)
        }
      }
    }

// respuestas del juego
   if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.quoted.text) return 
   if (!Fg.game) return
    if (m.quoted.from == Fg.game[from][0].from) {
        let json = JSON.parse(JSON.stringify(Fg.game[from][1]))
        if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
            m.reply(msg.benar(json.jawaban.toUpperCase(), isPoingame))
            await addPoin(sender, isPoingame)
            clearTimeout(Fg.game[from][3])
            clearTimeout(Fg.game[from][4])
            delete Fg.game[from]
        } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(msg.hampir)
        else m.reply(msg.salah)
    } return !0
    

} catch (e) {
  console.log(bgcolor('‣ Alerta :', 'red'), e);
}
};

/**
 *  WhatsApp bot  baileys 
 * 
 * Thank to 
 - https://github.com/MhankBarBar/weabot
 - https://github.com/Nurutomo/wabot-aq
 - All owner bot
*/