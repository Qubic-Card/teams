import formatter from '@lib/vcard/formatter';
import getBase64FromUrl from '@lib/utils/getBase64';
import { default as vCardJS } from 'tappin-vcards-js';

export const genvcard = async (prop, team, dateConnected) => {
  let personalEmail;
  let teamEmail;
  let wa;
  let vCard = new vCardJS();
  let email = prop?.socials
    ?.filter((e) => e.type.includes('email') && e.isActive)
    ?.map((e) => e.data);
  let emailTeam = team?.socials
    ?.filter((e) => e.type.includes('email') && e.isActive)
    ?.map((e) => e.data);

  //set basic properties shown before
  vCard.firstName = prop.firstname;
  vCard.lastName = prop.lastname ?? '';

  if (prop.company) vCard.organization = prop.company;

  if (prop.avatar)
    vCard.photo.embedFromString(
      await getBase64FromUrl(prop.avatar),
      'image/png'
    );

  if (prop.job) vCard.title = prop.job;

  if (dateConnected) {
    vCard.note =
      'Added via Qubic card on ' +
      new Date(new Date(dateConnected).setUTCHours(7)).toDateString().slice(4);
  } else {
    vCard.note =
      'Added via Qubic card on ' +
      new Date(new Date().setUTCHours(7)).toDateString().slice(4);
  }

  //set URL where the vCard can be found
  vCard.source = 'https://qubic.id';
  //set email addresses

  if (team) {
    if (team.logo)
      vCard.logo.embedFromString(
        await getBase64FromUrl(team.logo),
        'image/png'
      );

    // if (team.contactNumber) vCard.workPhone = team.contactNumber;

    // if (team.email) vCard.workEmail = team.email;

    //set address information

    if (team.address) {
      vCard.workAddress.label = 'Work Address';
      vCard.workAddress.street = team.address;
      vCard.workAddress.city = team.address.city;
      vCard.workAddress.stateProvince = team.address.state;
      vCard.workAddress.postalCode = team.address.postal;
      vCard.workAddress.countryRegion = team.address.country;
    }

    vCard.workEmail = emailTeam;

    if (team.socials) {
      team.socials.map((e, i) => {
        if (e.type === 'email') teamEmail = e.data;
        if (
          (e.type.includes('phone') && e.data.length > 0) ||
          e.type.includes('email')
        ) {
          return '';
        }

        if (e.type.includes('whatsapp'))
          wa = e.data.startsWith('+') ? e.data : '+' + e.data;

        return (vCard.socialUrls[e.type + i + 'cmpny'] = e.data);
      });

      let teamPhone = team.socials
        .filter((s) => s.type.includes('phone') && s.isActive)
        .map((s) => {
          s.data = s.data;
          if (s.data.startsWith('62')) s.data = '+' + s.data;
          if (s.data.startsWith('08')) {
            s.data = s.data.slice(1);
            s.data = '+62' + s.data;
          }

          return s.data;
        });

      if (teamPhone.length > 0) {
        teamPhone.forEach((p) => {
          if (wa !== p) {
            if (wa) {
              vCard.workPhone = teamPhone.concat(wa);
            } else vCard.workPhone = teamPhone.length > 1 ? teamPhone : p;
          } else {
            vCard.workPhone = teamPhone;
          }
        });
      } else {
        if (wa) vCard.workPhone = wa;
      }
    }

    if (team.links) {
      team.links.map((e) => {
        if (e.isActive)
          return (vCard.socialUrls[e.title + ' Company'] = e.link);
      });
    }
  }

  //set social media URLs
  if (team?.display_personal) {
    if (prop.socials) {
      prop.socials.map((e, i) => {
        if (e.isActive) {
          if (e.type === 'email') personalEmail = e.data;

          if (e.type.includes('whatsapp'))
            wa = e.data.startsWith('+') ? e.data : '+' + e.data;

          if (
            (e.type.includes('phone') && e.data.length > 0) ||
            e.type.includes('email')
          ) {
            return '';
          }

          return (vCard.socialUrls[e.type + i] = e.data);
        }
      });

      if (team?.display_personal) vCard.email = email;

      let phone = prop.socials
        .filter((s) => s.type.includes('phone') && s.isActive)
        .map((s) => {
          s.data = s.data;
          if (s.data.startsWith('62')) s.data = '+' + s.data;
          if (s.data.startsWith('08')) {
            s.data = s.data.slice(1);
            s.data = '+62' + s.data;
          }

          return s.data;
        });

      if (phone.length > 0) {
        phone.forEach((p) => {
          if (wa !== p) {
            if (wa) {
              vCard.cellPhone = phone.concat(wa);
            } else vCard.cellPhone = phone.length > 1 ? phone : p;
          } else {
            vCard.cellPhone = phone;
          }
        });
      } else {
        if (wa) vCard.cellPhone = wa;
      }
    }

    if (prop.address) {
      vCard.homeAddress.label = 'Home Address';
      vCard.homeAddress.street = prop.address;
    }

    if (prop.links) {
      prop.links.map((e) => {
        if (e.isActive) return (vCard.socialUrls[e.title] = e.link);
      });
    }
  }

  vCard.version = '3.0'; //can also support 2.1 and 4.0, certain versions only support certain fields

  const formatted = formatter(vCard.getFormattedString());
  return formatted;
};
