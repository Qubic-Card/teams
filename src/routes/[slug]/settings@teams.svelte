<script>
  import roleMapping from '@lib/role';
  import AddNewRoleModal from '@comp/modals/addNewRoleModal.svelte';
  import supabase from '@lib/db';
  import Cookies from 'js-cookie';

  let teamId = parseInt(Cookies.get('teamId'));
  let roles = [];
  let roless = [];
  let isOpen = false;
  let roleName = 'Member';

  const getTeamsRoleMapping = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select('role_mapping')
      .eq('id', teamId);

    if (error) console.log(error);

    if (data) {
      console.log(data[0].role_mapping);
      roless = data[0].role_mapping;
      return data[0].role_mapping;
    }
  };
  // {
  //   "admin": [
  //     "allow_read_members",
  //     "allow_read_team",
  //     "allow_read_analytics",
  //     "allow_write_members",
  //     "allow_write_team",
  //     "allow_write_profile"
  //   ]
  // }
  const updateTeamsRoleMapping = async () => {
    const { data, error } = await supabase
      .from('teams')
      .update({ role_mapping: { roleName: [roles] } })
      .eq('id', teamId);

    if (error) console.log(error);

    if (data) {
      console.log(data);
      return data;
    }
  };

  $: {
    console.log(isOpen);
    // console.log(roleMapping);
    console.log(roles);
    console.log(roless);
    console.log(Object.keys(roless));
  }
  $: getTeamsRoleMapping();
  const openModal = () => (isOpen = true);
  const closeModal = () => (isOpen = false);
</script>

<div class="min-h-screen flex gap-4">
  <div class="bg-neutral-800 w-2/3 rounded-lg p-4">
    <div class="flex justify-between items-center">
      <h1 class="font-bold text-3xl">Role Settings</h1>
      <button
        class="p-4 w-56 bg-white text-black rounded-lg"
        on:click={openModal}>+ add new role</button
      >
      <button on:click={updateTeamsRoleMapping}>TEST UPDATE</button>
      <AddNewRoleModal {isOpen} on:close={closeModal} />
    </div>
    <div class="mt-4 border-b-2 border-neutral-600 pb-12">
      <h1 class="text-2xl mb-4">Admin</h1>

      {#each roleMapping as role}
        <div
          class="flex w-full justify-between items-center bg-neutral-700 p-4 rounded-lg mb-2"
        >
          <!-- <input
            type="checkbox"
            bind:group={roles}
            value={role.name}
            class="border-2 border-neutral-700 bg-red-500 w-7 h-7 checked:bg-red-600 shadow checked:shadow-xl rounded-lg"
          />
          <h1 class="w-1/2 ml-4">{role.name}</h1> -->
          <div class="block">
            <div class="mt-2">
              <label class="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  bind:group={roles}
                  value={role.name}
                  class="border-2 border-neutral-700 bg-red-500 w-7 h-7 checked:bg-red-600 shadow checked:shadow-xl rounded-lg"
                />
                <span class="ml-2">{role.name}</span>
              </label>
            </div>
          </div>
          <p class="w-2/3">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
            nihil?
          </p>
        </div>
      {/each}
    </div>
  </div>
  <div class="flex flex-col w-1/3 rounded-lg gap-4">
    <div class="bg-neutral-800 h-1/2 p-4 rounded-lg">
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed vel eius sit
      esse illo inventore excepturi nobis unde, aliquam doloremque hic vero qui
      non rerum rem ducimus velit sequi quibusdam. Facilis eligendi autem
      officiis voluptatum cum expedita, deserunt corporis sit consequatur
      doloribus eaque esse! Nobis consectetur neque dicta maiores? Labore
      maiores natus placeat soluta maxime doloremque cum rerum hic laudantium
      eum perferendis voluptatibus unde, nesciunt harum.
    </div>
    <div class="bg-neutral-800 h-1/2 p-4 rounded-lg">
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed vel eius sit
      esse illo inventore excepturi nobis unde, aliquam doloremque hic vero qui
      non rerum rem ducimus velit sequi quibusdam. Facilis eligendi autem
      officiis voluptatum cum expedita, deserunt corporis sit consequatur
      doloribus eaque esse! Nobis consectetur neque dicta maiores? Labore
      maiores natus placeat soluta maxime doloremque cum rerum hic laudantium
      eum perferendis voluptatibus unde, nesciunt harum.
    </div>
  </div>
</div>
