<script>
  import ConnectModal from '@comp/modals/connectModal.svelte';
  import AvatarCard from '@comp/cards/avatarCard.svelte';
  import BorderButton from '@comp/buttons/borderButton.svelte';
  import { socialIcons } from '@lib/constants';
  import LinkPreview from '@comp/cards/linkPreview/linkPreview.svelte';
  import { socials, links } from '@lib/stores/editorStore';
  import { theme } from '@lib/profileTheme';
  import Dummy from '@lib/dummy.json';
  import { log } from '@lib/logger/logger';
  import { page } from '$app/stores';
  import { VCard } from '@covve/easy-vcard';
  import { go } from '@lib/utils/forwarder';
  import formatter from '@lib/vcard/formatter';
  import {
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
  } from '@rgossiaux/svelte-headlessui';
  import supabase from '@lib/db';

  export let data;
  export let isEditorMode = false;
  export let profileUid;
  export let cardId;
  export let teamId;

  let imageBase64 = null;
  let showModal = false;
  let companyName = null;
  let companyNickname = null;
  let companyDesc = null;
  let companyAddress = null;
  let companyLogo = null;
  let currentTheme = theme[data.design?.theme?.toString() ?? 'dark'];

  const downloadContactHandler = (vCardString, fileName) => {
    const fileURL = URL.createObjectURL(
      new Blob([vCardString], { type: 'text/vcard;charset=utf-8' })
    );
    let fileLink = document.createElement('a');
    fileLink.href = fileURL;
    fileLink.download = `${fileName}.vcf`;
    document.body.appendChild(fileLink);
    fileLink.click();
  };

  const getBase64FromUrl = async (url) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  };

  const iOS = () => {
    return (
      [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod',
      ].includes(navigator.platform) ||
      // iPad on iOS 13 detection
      (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
    );
  };

  // getBase64FromUrl(data.avatar).then((base64) => (imageBase64 = base64));

  let phoneNumber = null;
  $: phoneNumber;
  data.socials.map((social) => {
    if (social.type === 'phone') {
      phoneNumber = social.data;
      if (phoneNumber.startsWith('+')) phoneNumber = phoneNumber.slice(1);
      if (phoneNumber.startsWith('0')) {
        phoneNumber = phoneNumber.slice(1);
        phoneNumber = '62' + phoneNumber;
      }
    }
  });

  const addToContactHandler = () => {
    let vcard = new VCard();
    vcard
      .setFullName(`${data.firstname} ${data.lastname}`)
      .addFirstName(`${data.firstname}`)
      .addLastName(`${data.lastname}`)
      .addTitle(`${data.job}`)
      .addOrganization(`${data.company}`, [])
      .addPhoto(data.avatar);

    data.socials.map((social) => {
      if (social.isActive === true) {
        if (social.type === 'facebook') {
          vcard.addUrl(`https://facebook.com/${social.data}`, {
            label: 'Facebook',
          });
        }
        if (social.type === 'twitter') {
          vcard.addUrl(`https://twitter.com/${social.data}`, {
            label: 'Twitter',
          });
        }
        if (social.type === 'instagram') {
          vcard.addUrl(`https://instagram.com/${social.data}`, {
            label: 'Instagram',
          });
        }
        if (social.type === 'linkedin') {
          vcard.addUrl(`https://linkedin.com/in/${social.data}`, {
            label: 'LinkedIn',
          });
        }
        if (social.type === 'tiktok') {
          vcard.addUrl(`https://tiktok.com/${social.data}`, {
            label: 'TikTok',
          });
        }

        if (social.type === 'youtube') {
          vcard.addUrl(`https://youtube.com/${social.data}`, {
            label: 'YouTube',
          });
        }

        if (social.type === 'whatsapp') {
          vcard.addUrl(`https://wa.me/${social.data.split('+')}`, {
            label: 'Whatsapp',
          });
          if (social.data !== phoneNumber) {
            vcard.addPhone(`+${social.data}`);
          }
        }

        if (social.type === 'line') {
          vcard.addUrl(`https://line.me/R/ti/p/~${social.data}`, {
            label: 'Line',
          });
        }

        if (social.type === 'email') {
          vcard.addEmail(`${social.data}`);
        }

        if (social.type === 'phone') {
          vcard.addPhone(`${social.data}`);
        }
      }
    });
    data.links.map((link) => {
      if (link.isActive === true) {
        vcard.addUrl(`${link.link}`, {
          label: 'Website',
        });
      }
    });

    const formattedText = vcard.toVcard(true);

    const iosFormattedText = formatter(
      vcard.toString(),
      true,
      data.socials,
      data.links
    );

    const androidFormattedText = formatter(formattedText, false);

    log('Your contact was added to a phone', 'INFO', null, cardId, profileUid);

    downloadContactHandler(
      iOS() ? iosFormattedText : androidFormattedText,
      `qubicContact`
    );
  };

  const getTeams = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId);

    if (error) console.log(error);
    if (data) {
      companyName = data[0].metadata.company;
      companyNickname = data[0].nickname;
      companyAddress = data[0].metadata.address;
      companyDesc = data[0].metadata.description;
      companyLogo = data[0].metadata.logo;
      return data;
    }
  };
  $: getTeams();
  const modalHandler = () => (showModal = !showModal);
  const downloadHandler = () => console.log('Brosur has been downloaded');
</script>

<div class={`${currentTheme.pageBackground} ${$$props.class}`}>
  <!-- HEAD -->
  <div class="w-full p-4">
    <div
      class="rounded-2xl h-32 relative bg-center object-cover"
      style={`background: url(${
        data.design?.background == ''
          ? Dummy.design?.background
          : data.design?.background
      });`}
    >
      <AvatarCard
        class="pt-8"
        height="125px"
        width="125px"
        background={data?.avatar == '' ? Dummy.avatar : data?.avatar}
      />
    </div>
  </div>
  <!-- BIO -->
  <div
    class=" justify-center items-center flex flex-col pt-6 {currentTheme.text}"
  >
    <h1 class="text-lg font-bold">
      {data.firstname == ''
        ? Dummy.firstname
        : data.firstname + ' ' + data?.lastname}
    </h1>
    <h1 class="text-sm opacity-80">
      {data.job == '' ? Dummy.job : data.job}
    </h1>
    <h1 class="text-md opacity-90">
      {data.company == '' ? Dummy.company : data.company}
    </h1>
  </div>
  <TabGroup class="flex flex-col items-center w-full text-white mt-4">
    <TabList
      class="flex w-2/3 bg-black border-2 border-neutral-700 rounded-lg p-2"
    >
      <Tab
        class={({ selected }) =>
          selected
            ? 'bg-white text-black p-2 rounded-l-lg w-1/2'
            : 'bg-neutral-800 text-white p-2 rounded-l-lg w-1/2'}
        >{companyNickname ?? '-'}</Tab
      >
      <Tab
        class={({ selected }) =>
          selected
            ? 'bg-white text-black p-2 rounded-r-lg w-1/2'
            : 'bg-neutral-800 text-white p-2 rounded-r-lg w-1/2'}
        >My Contact</Tab
      >
    </TabList>
    <TabPanels class="w-full">
      <TabPanel>
        <div class="gap-2 flex flex-col px-16 justify-center items-center mt-4">
          <div
            class="flex gap-2 flex-col w-full border-2 border-neutral-700 rounded-lg p-4"
          >
            <div class="flex">
              <img
                src={companyLogo ?? 'https://placeimg.com/80/80/any'}
                alt=""
                class="rounded-lg w-16 h-16 mr-2"
              />
              <h1>{companyName ?? '-'}</h1>
            </div>
            <p>{companyAddress ?? '-'}</p>
            <p class="text-neutral-400">
              {companyDesc ?? '-'}
            </p>
          </div>
          <div
            on:click={downloadHandler}
            class="w-full border-2 border-neutral-700 rounded-lg p-4 cursor-pointer"
          >
            <h1>Know more about us</h1>
            <p class="text-neutral-400">Download brosur starbucks</p>
          </div>
        </div>
      </TabPanel>
      <TabPanel>
        <div class="sm:px-20 px-16 mt-4 {currentTheme.text}">
          <!-- UTILITIES -->
          <BorderButton
            class="w-full h-12 {currentTheme.border} {currentTheme.secondary} rounded-md"
            on:click={modalHandler}
          >
            Connect with Me
          </BorderButton>
          <ConnectModal
            on:showModal={modalHandler}
            {showModal}
            {profileUid}
            {cardId}
            {data}
          />
          <div class="flex justify-between flex-wrap items-start gap-1 my-1">
            {#each isEditorMode ? $socials : data.socials as item}
              {#if item.isActive}
                <BorderButton
                  on:click={() => {
                    go(
                      item.type,
                      item.data,
                      $page.url.searchParams.get('type'),
                      cardId,
                      profileUid
                    );
                  }}
                  class="p-5 flex-grow flex justify-center rounded-md items-center {currentTheme.border} {currentTheme.secondary}"
                  ><img
                    src={socialIcons[item.type]}
                    width="32"
                    height="32"
                    alt=""
                  /></BorderButton
                >
              {/if}
            {/each}
          </div>
          <BorderButton
            class="w-full h-12 mb-10 {currentTheme.border} {currentTheme.secondary} rounded-md"
            on:click={addToContactHandler}
          >
            Add to Contacts
          </BorderButton>

          <!-- LINKS -->
          <div class="gap-2 flex flex-col justify-center items-center pb-5">
            {#each isEditorMode ? $links : data.links as item}
              {#if item.isActive}
                <BorderButton
                  class="w-full {currentTheme.border} {currentTheme.secondary} rounded-md"
                  ><div class="p-2">
                    <LinkPreview
                      title={item.title}
                      url={item.link}
                      className={currentTheme.secondary}
                      {profileUid}
                      {cardId}
                    />
                  </div></BorderButton
                >
              {/if}
            {/each}
          </div>
        </div>
      </TabPanel>
    </TabPanels>
  </TabGroup>
</div>
