<script>
  import { fade } from "svelte/transition";
  import Cropper from "svelte-easy-crop";
  import getCroppedImg from "@lib/utils/canvas";
  import supabase from "@lib/db";
  import { Dialog } from "@rgossiaux/svelte-headlessui";
  import { user } from "@lib/stores/userStore";
  import { createEventDispatcher } from "svelte";
  import getFileFromBase64 from "@lib/utils/getFileFromBase64";
  import Spinner from "../loading/spinner.svelte";
  import { basicProfile } from "@lib/stores/profileData";
  // import ModalOverlay from '@comp/modals/modalOverlay.svelte';

  export let isOpen, handleSave, image, fileName, isBanner;
  export let aspect = 1;
  // e5b936c8-77fd-4cd9-a5b5-0ff7c1ea31eb
  let croppedImage = "";
  let pixelCrop;
  let fileImage;
  let isLoading = false;

  const dispatch = createEventDispatcher();

  const updatedData = (data) => dispatch("updatedData", data);
  const closeModal = () => {
    dispatch("closeModal", false);
    croppedImage = "";
  };

  const cropImage = async () => {
    croppedImage = await getCroppedImg(image, pixelCrop);
    fileImage = getFileFromBase64(croppedImage, fileName);
  };

  const previewCrop = (e) => {
    pixelCrop = e.detail.pixels;
    const { x, y, width } = e.detail.pixels;
    const scale = 200 / width;
  };

  const getBannerPath = () => {
    if ($basicProfile.isBusiness) {
      if ($basicProfile.design.backgroundBusiness) {
        const background = $basicProfile.design.backgroundBusiness;
      
        const i = background.indexOf(`${$user.id}`);
        return background.slice(i);
      } else {
        return false;
      }
    } else {
      if ($basicProfile.design.background) {
        const background = $basicProfile.design.background;
      
        const i = background.indexOf(`${$user.id}`);
        return background.slice(i);
      } else {
        return false;
      }
    }
  };

  const getAvatarPath = () => {
    if ($basicProfile.avatar) {
      const avatar = $basicProfile.avatar;
      console.log("avatar", avatar);
      const i = avatar.indexOf(`${$user.id}`);
      return avatar.slice(i);
    }
    return false;
  };

  const uploadBanner = async (fileFormat, file_name) => {
    const { error } = await supabase.storage
      .from("banner")
      .upload(`${$user?.id}/${file_name}`, fileImage, {
        contentType: `image/${fileFormat}`,
        upsert: true,
      });
    if (error) {
      console.log("error", error);
    } else {
      const { data: banner } = supabase.storage
        .from("banner")
        .getPublicUrl(`${$user?.id}/${file_name}`);
      updatedData({ url: banner.publicUrl, isBanner: true });
    }
  };

  const uploadAvatar = async (fileFormat, file_name) => {
    const { error } = await supabase.storage
      .from("avatars")
      .upload(`${$user?.id}/${file_name}`, fileImage, {
        contentType: `image/${fileFormat}`,
        upsert: true,
      });
    if (error) {
      console.log("error", error);
    } else {
      const { data: avatar } = supabase.storage
        .from("avatars")
        .getPublicUrl(`${$user?.id}/${file_name}`);

      updatedData({ url: avatar.publicUrl, isBanner: false });
    }
  };

  const handleAddFile = async () => {
    isLoading = true;
    let fileFormat = `${fileImage.type.split("/")[1]}`;
    const bannerPath = getBannerPath();
    const avatarPath = getAvatarPath();
    const file_name = fileName;
    
    // HANDLING BANNER
    if (isBanner) {
      if (bannerPath) {
        const { error: err } = await supabase.storage
          .from("banner")
          .remove([bannerPath]);

        if (err) {
          console.log(err);
        } else {
          await uploadBanner(fileFormat, file_name);
        }
      } else {
        await uploadBanner(fileFormat, file_name);
      }
    }

    // HANDLING AVATAR
    else {
      if (avatarPath) {
        const { error: err } = await supabase.storage
          .from("avatars")
          .remove([avatarPath]);
        if (err) {
          console.log(err);
        } else {
          await uploadAvatar(fileFormat, file_name);
        }
      } else {
        await uploadAvatar(fileFormat, file_name);
      }
    }

    isOpen = false;
    croppedImage = "";
    image = "";
    await handleSave();
    isLoading = false;
  };
</script>

{#if isOpen}
  <div
    transition:fade|local={{ duration: 200 }}
    class="fixed inset-0 bg-black/50 z-50"
    aria-hidden="true"
    on:click
  />
{/if}

<Dialog
  static
  class={`${
    isOpen ? "translate-x-0" : "translate-x-[900px]"
  } transition-all duration-300 ease-in-out flex justify-between flex-col h-screen w-full md:w-1/3 p-4 gap-4 bottom-0 right-0 z-50 fixed bg-white border-l-2 border-neutral-300 text-black overflow-y-auto snap-y snap-mandatory`}
  open={isOpen}
  on:close={() => {
    isOpen = false;
    closeModal();
  }}
>
  <p
    class="self-end mt-8"
    on:click={() => {
      isOpen = false;
      closeModal();
    }}
  >
    x
  </p>

  <div class="h-full">
    <h2>Crop image</h2>
    <div class="relative h-1/2">
      <Cropper
        {image}
        {aspect}
        zoom="1"
        crop={{ x: 0, y: 0 }}
        on:cropcomplete={previewCrop}
      />
    </div>
    {#if croppedImage}
      <h2>Preview</h2>
      <img
        src={croppedImage}
        alt="Cropped profile"
        class={`${
          isBanner ? "w-full h-48" : "w-64 h-64"
        } rounded-2xl aspect-square bg-black mx-auto border border-neutral-700 object-cover`}
      /><br />
    {/if}
  </div>
  <div class="flex w-full gap-2">
    {#if croppedImage}
      <button
        in:fade|local={{ duration: 300 }}
        type="button"
        class="bg-black p-2 w-1/2 text-white rounded-md h-12 shadow-md"
        on:click={() => {
          croppedImage = null;
        }}>Reset</button
      >
      <button
        in:fade|local={{ duration: 300 }}
        type="button"
        class="bg-blue-600 p-2 w-1/2 text-white rounded-md h-12 shadow-md flex justify-center items-center gap-2"
        on:click={async () => await handleAddFile()}
      >
        {#if isLoading}
          <Spinner class="w-6 h-6" />
        {/if}
        Save
      </button>
    {:else}
      <button
        in:fade|local={{ duration: 300 }}
        type="button"
        class="bg-blue-600 p-2 w-full text-white rounded-md h-12 shadow-md"
        on:click={async () => await cropImage()}>Crop</button
      >
    {/if}
  </div>
</Dialog>
