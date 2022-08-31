import formatter from '@lib/vcard/formatter';
import getBase64FromUrl from '@lib/utils/getBase64';
import { default as vCardJS } from 'tappin-vcards-js';

export const genvcard = async (prop, team) => {
  let phoneNumber;
  let teamPhoneNumber;
  let personalEmail;
  let teamEmail;

  let vCard = new vCardJS();
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

  vCard.note =
    'Added via Qubic card on ' +
    new Date(new Date().setUTCHours(7)).toDateString().slice(4);

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

    if (team.socials) {
      team.socials.map((e) => {
        if (e.type === 'phone') {
          teamPhoneNumber = e.data;
          if (teamPhoneNumber.startsWith('+'))
            teamPhoneNumber = teamPhoneNumber.slice(1);
          if (teamPhoneNumber.startsWith('08')) {
            teamPhoneNumber = teamPhoneNumber.slice(1);
            teamPhoneNumber = '+62' + teamPhoneNumber;
          }
          if (teamPhoneNumber.startsWith('62')) teamPhoneNumber = '+' + e.data;
        }
        if (e.type === 'email') teamEmail = e.data;
        if (e.type == 'phone') return (vCard.workPhone = e.data);

        if (e.type === 'whatsapp') {
          if ('+' + e.data !== teamPhoneNumber) {
            vCard.workPhone = ['+' + e.data, teamPhoneNumber];
          }
        }

        return (vCard.socialUrls[e.type + 'cmpny'] = e.data);
      });
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
      prop.socials.map((e) => {
        if (e.isActive) {
          if (e.type === 'email') personalEmail = e.data;
          if (e.type === 'phone') {
            phoneNumber = e.data;
            // if (phoneNumber.startsWith('+')) phoneNumber = phoneNumber.slice(1);
            if (phoneNumber.startsWith('08')) {
              phoneNumber = phoneNumber.slice(1);
              phoneNumber = '+62' + phoneNumber;
            }
            if (phoneNumber.startsWith('62')) phoneNumber = '+' + e.data;
          }

          if (e.type === 'whatsapp') {
            if ('+' + e.data !== phoneNumber)
              vCard.cellPhone = ['+' + e.data, phoneNumber];
          }

          if (e.type == 'phone') return (vCard.cellPhone = phoneNumber);

          return (vCard.socialUrls[e.type] = e.data);
        }
      });
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

  if (teamEmail === undefined) {
    if (team?.display_personal) vCard.email = personalEmail;
  } else {
    if (team?.display_personal) vCard.email = personalEmail;
    vCard.workEmail = teamEmail;
  }

  vCard.version = '3.0'; //can also support 2.1 and 4.0, certain versions only support certain fields

  const formatted = formatter(vCard.getFormattedString());
  return formatted;
};
