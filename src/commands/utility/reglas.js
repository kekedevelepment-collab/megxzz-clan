const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const REGLAS = `**1. Respeto**
Respeta a todos los miembros de la comunidad. No se permite el acoso, las amenazas, la discriminación, las provocaciones constantes, los insultos directos o indirectos ni cualquier comportamiento que genere un ambiente tóxico.

**2. Spam y Flood**
Queda prohibido hacer spam, flood, cadenas de mensajes, abuso de mayúsculas, menciones innecesarias o repetir mensajes, emojis, GIFs o enlaces con el fin de llamar la atención.

**3. Uso correcto de los canales**
Utiliza cada canal para el tema correspondiente. Evita el off-topic en canales importantes y mantén el servidor organizado.

**4. Contenido prohibido**
Está prohibido compartir contenido NSFW, ilegal, gore, extremadamente ofensivo, enlaces engañosos, estafas o cualquier material inapropiado para la comunidad.

**5. Staff**
Respeta las decisiones del Staff. Si no estás de acuerdo con alguna sanción o decisión, utiliza los tickets para presentar tu caso. No generes discusiones públicas ni intentes evadir sanciones.

**6. Promoción**
La publicidad únicamente está permitida en el canal correspondiente. Queda prohibido promocionar servidores, redes sociales o enviar invitaciones por otros canales sin autorización.

**7. Comportamiento**
Mantén una actitud madura y respetuosa. Evita generar drama, conflictos innecesarios o cualquier comportamiento que perjudique el ambiente de la comunidad.

**8. Privacidad**
No compartas datos personales, direcciones IP, cuentas o cualquier información privada tuya o de otros miembros sin consentimiento.

**9. Seguridad**
Está estrictamente prohibido compartir malware, RATs, phishing, archivos maliciosos o cualquier contenido que pueda poner en riesgo la seguridad de otros usuarios.

**10. Uso de Bots**
Utiliza los bots de forma responsable. No abuses de comandos ni los utilices para molestar, saturar el chat o afectar el funcionamiento del servidor.

**11. Canales de voz**
Respeta a los demás usuarios. Evita gritos, ruidos molestos, eco, spam de sonidos o interrupciones constantes durante las conversaciones.

**12. Actividad**
Los miembros con cargos importantes deberán mantenerse activos. No se permite el trolling excesivo ni las actitudes tóxicas repetitivas.

**13. Suplantación de identidad**
No utilices nombres, fotos de perfil o identidades que puedan confundirse con otros miembros, aliados o integrantes del Staff.

**14. Sanciones**
Las sanciones podrán incluir Warn, Mute, Kick o Ban, dependiendo de la gravedad de la infracción y de la reincidencia. El uso de cuentas alternativas para evadir sanciones aumentará el castigo.`;

module.exports = {
  data: new SlashCommandBuilder().setName('reglas').setDescription('Muestra las reglas del servidor.'),

  async execute(interaction) {
    const embed = new EmbedBuilder().setColor(0xed4245).setTitle('📋 Reglas del servidor').setDescription(REGLAS);

    await interaction.reply({ embeds: [embed] });
  },
};
