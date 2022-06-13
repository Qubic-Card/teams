<script>
  import supabase from '@lib/db';
  import { toastFailed, toastSuccess } from '@lib/utils/toast';
  import Spinner from '@comp/loading/spinner.svelte';
  import Input from '@comp/input.svelte';
  import { user } from '@lib/stores/userStore';
  import { getProfileId } from '@lib/query/getId';
  import {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
  } from '@rgossiaux/svelte-headlessui';
  import DropdownButton from '@comp/buttons/dropdownButton.svelte';

  let nickname = '';
  let commercialName = '';
  let discCode = '';
  let disc = 'Rp 0';
  let showModal = false;
  let loading = false;
  let selectedMemberType = '';
  let selectedTimeType = '';

  let data = ['name', 'name1', 'name2'];

  let timeType = ['1', '2', '3'];
  let memberType = ['5', '10', '15'];

  const toggleModal = () => (showModal = !showModal);
  const selectMemberType = (type) => (selectedMemberType = type);
  const selectTimeType = (type) => (selectedTimeType = type);
  const addTeam = async () => {
    let profileId = await getProfileId($user?.id);

    try {
      // let teamId = await getTeamId($user?.id);
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: commercialName,
          nickname: nickname,
          metadata: {
            logo: '',
            email: '',
            links: [],
            phone: '',
            address: '',
            company: '',
            socials: [],
            description: '',
          },
        });

      if (teamError) {
        console.log(teamError);
      }

      const { data: role, error: roleError } = await supabase
        .from('team_roles')
        .insert({
          role_maps: [
            'allow_read_members',
            'allow_read_team',
            'allow_read_analytics',
            'allow_read_connections',
            'allow_write_members',
            'allow_write_team',
            'allow_write_profile',
          ],
          role_name: 'Admin',
          team_id: team[0].id,
        });

      if (roleError) {
        console.log(roleError);
      }

      const { data: teamMember, error: teamMemberError } = await supabase
        .from('team_members')
        .insert(
          {
            uid: $user?.id,
            profile: profileId,
            team_profile: {
              job: '',
              links: [],
              avatar: '',
              design: {},
              company: '',
              socials: [],
              lastname: '',
              firstname: '',
            },
            team_id: team[0].id,
            role: role[0].id,
          },
          { returning: 'minimal' }
        );

      if (teamError) {
        loading = false;
        throw new Error(teamError.message);
      } else {
        loading = false;
        toastSuccess('Team added successfully');
        toggleModal();
        setTimeout(() => {
          location.reload();
        }, 500);
      }
    } catch (error) {
      loading = false;
      console.log(error);
    }
  };
</script>

<button class="cursor-pointer p-2" on:click={toggleModal}> + add team </button>
{#if showModal}
  <div
    class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
  >
    <div class="relative w-1/2 my-6 mx-auto md:max-w-3xl max-w-md">
      <!--content-->
      <div
        class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-neutral-900 outline-none focus:outline-none"
      >
        <!--header-->
        <div class="p-5 border-b border-solid rounded-t">
          <div class="flex w-full justify-between items-center">
            <h3 class="text-xl font-semibold">Register a new team</h3>
            <p on:click={toggleModal} class="cursor-pointer font-bold text-lg">
              x
            </p>
          </div>
        </div>
        <!--body-->
        <div
          class="flex flex-col justify-center bg-neutral-900 items-center p-4 rounded-lg gap-6"
        >
          <div class="flex w-full border-b-2 border-neutral-700 pb-4 gap-2">
            <Input
              placeholder="Commercial Name"
              title="Commercial Name"
              bind:value={nickname}
              class="w-full"
              isEmptyChecking={true}
            />
            <Input
              placeholder="Nickname"
              title="Nickname"
              bind:value={commercialName}
              class="w-full"
              isEmptyChecking={true}
            />
          </div>
          <div class="flex w-full gap-2">
            <Menu as="div" class="w-full mx-2" let:open>
              <DropdownButton
                class="w-full"
                label={selectedMemberType !== ''
                  ? selectedMemberType + ' members'
                  : 'Please select a member type'}
              />
              {#if open}
                <div>
                  <MenuItems
                    class="top-[265px] left-6 z-40 absolute rounded-md flex flex-col bg-neutral-900 shadow-md border border-neutral-700 p-2 w-[45%]"
                  >
                    {#each memberType as item}
                      <MenuItem
                        on:click={() => selectMemberType(item)}
                        class="flex hover:bg-neutral-700 px-2 py-2 rounded-md"
                      >
                        {item} members
                      </MenuItem>
                    {/each}
                  </MenuItems>
                </div>
              {/if}
            </Menu>
            <Menu as="div" class="w-full mx-2" let:open>
              <DropdownButton
                class="w-full"
                label={selectedTimeType !== ''
                  ? selectedTimeType + ' tahun'
                  : 'Please select a time type'}
              />
              {#if open}
                <div>
                  <MenuItems
                    class="top-[265px] right- z-40 absolute rounded-md flex flex-col bg-neutral-900 shadow-md border border-neutral-700 p-2 w-[45%]"
                  >
                    {#each timeType as item}
                      <MenuItem
                        on:click={() => selectTimeType(item)}
                        class="flex hover:bg-neutral-700 px-2 py-2 rounded-md"
                      >
                        {item} tahun
                      </MenuItem>
                    {/each}
                  </MenuItems>
                </div>
              {/if}
            </Menu>
          </div>
          <div class="flex w-full border-b-2 border-neutral-700 pb-4 gap-2">
            <Input
              placeholder="Discount Code"
              title="Discount Code"
              bind:value={discCode}
              class="w-full"
              isEmptyChecking={true}
            />
            <Input
              placeholder=""
              title=""
              bind:value={disc}
              class="w-full justify-end"
              disabled={true}
            />
          </div>
          <button
            on:click={async () => {
              nickname === ''
                ? toastFailed('Team name is required')
                : await addTeam();
            }}
            disabled={nickname === '' || commercialName === '' ? true : false}
            class="flex justify-center items-center p-3 w-full bg-neutral-700 hover:bg-neutral-800 hover:border hover:border-neutral-500 disabled:opacity-30"
          >
            {#if loading}
              <Spinner class="w-7 h-7" />
            {:else}
              Add
            {/if}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="opacity-25 fixed inset-0 z-40 bg-black" />
{/if}
