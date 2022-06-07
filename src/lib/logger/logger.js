import supabase from '@lib/db';

export const log = async (message, type, link, cardId, uid) => {
  if(uid){
    const msgToWrite =
    cardId != null
      ? { message: message, link: link ?? '', card: cardId }
      : { message: message };

  const { error } = await supabase
    .from('logs')
    .insert([{ data: msgToWrite, type: type, uid: uid }]);

  if (error) console.log(error);
  }

  return 200;
};

export const logTap = async (type, cardId, uid) => {
  const { error } = await supabase.from('logs').insert([
    {
      data: {
        message: 'Your profile was opened through ' + type,
        card: cardId,
      },
      type: 'INFO',
      uid: uid,
    },
  ]);

  switch (type) {
    case "NFC":
      await supabase
      .rpc('increment_nfc_tap_count', { card: cardId });
      break;
    case "QRScan":
      await supabase
      .rpc('increment_qr_scan_count', { card: cardId });
      break;
    case "QRShare":
      await supabase
      .rpc('increment_qr_share_count', { card: cardId });
  }

  if (error) console.log(error);

  return 200;
};
