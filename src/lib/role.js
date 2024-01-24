const roleMapping = [
  {
    desc: 'Dapat mengakses semua fitur',
    desc_eng: "Provides the privilege to access all features",
    name: 'super_admin',
    value: 'super_admin',
  },
  {
    desc: 'Perbolehkan user untuk membaca user lain',
    desc_eng: "Provides the privilege to view other member's profile",
    name: 'allow_read_members',
    value: 'allow_read_members',
  },
  {
    desc: 'Perbolehkan user untuk membaca profile team',
    desc_eng: "Provides the privilege to view other team's profile", 
    name: 'allow_read_team',
    value: 'allow_read_team',
  },
  {
    desc: 'Perbolehkan user untuk membaca analytics',
    desc_eng: "Provides the privilege to view analytics",
    name: 'allow_read_analytics',
    value: 'allow_read_analytics',
  },
  {
    desc: 'Perbolehkan user untuk membaca koneksi team',
    desc_eng: "Provides the privilege the team's connections",
    name: 'allow_read_connections',
    value: 'allow_read_connections',
  },
  {
    desc: 'Perbolehkan user untuk membaca role dalam team',
    desc_eng: "Provides the privilege to view the analytics tab on 'members' tab",
    name: 'allow_read_roles',
    value: 'allow_read_roles',
  },
  {
    desc: 'Perbolehkan user untuk membaca billing team',
    desc_eng: "Provides the privilege to read billing information",
    name: 'allow_read_billing',
    value: 'allow_read_billing',
  },
  {
    desc: 'Perbolehkan user untuk mengedit dan membaca user lain',
    desc_eng: "Provides the privilege to edit and read other member's profile",
    name: 'allow_read & write_members',
    value: 'allow_write_members',
  },
  {
    desc: 'Perbolehkan user untuk mengedit dan membaca team',
    desc_eng: "Provides the privilege to read and edit the team's profile",
    name: 'allow_read & write_team',
    value: 'allow_write_team',
  },
  {
    desc: 'Perbolehkan user untuk mengedit dan membaca profile',
    desc_eng: "Provides the privilege to view and edit their own profile",
    name: 'allow_read & write_profile',
    value: 'allow_write_profile',
  },
  {
    desc: 'Perbolehkan user untuk membuat dan membaca team records',
    desc_eng: "Provides the privilege to view and create record on the 'records' tab",
    name: 'allow_read & write_records',
    value: 'allow_write_records',
  },
  {
    desc: 'Perbolehkan user untuk membuat dan membaca role dalam team',
    desc_eng: "Provides the privilege to view and edit member roles within the team",
    name: 'allow_read & write_roles',
    value: 'allow_write_roles',
  },
  {
    desc: 'Perbolehkan user untuk membuat dan membaca billing team',
    desc_eng: "Provides the privilege to read and edit billing information",
    name: 'allow_read & write_billing',
    value: 'allow_write_billing',
  },
  {
    desc: 'Perbolehkan user untuk mengedit dan membaca koneksi team',
    desc_eng: "Provides the privilege to view and edit the team's connections",
    name: 'allow_read & write_connections',
    value: 'allow_write_connections',
  },
  {
    desc: 'Perbolehkan user untuk melihat dan membaca profile',
    desc_eng: "Provides the privilege to view their own profile",
    name: 'allow_read_profile',
    value: 'allow_read_profile',
  },
];

export default roleMapping;
