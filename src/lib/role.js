const roleMapping = [
  {
    desc: 'Dapat mengakses semua fitur',
    name: 'super_admin',
    value: 'super_admin',
  },
  {
    desc: 'Perbolehkan user untuk membaca user lain',
    name: 'allow_read_members',
    value: 'allow_read_members',
  },
  {
    desc: 'Perbolehkan user untuk membaca team',
    name: 'allow_read_team',
    value: 'allow_read_team',
  },
  {
    desc: 'Perbolehkan user untuk membaca analytics',
    name: 'allow_read_analytics',
    value: 'allow_read_analytics',
  },
  {
    desc: 'Perbolehkan user untuk membaca koneksi team',
    name: 'allow_read_connections',
    value: 'allow_read_connections',
  },
  {
    desc: 'Perbolehkan user untuk membaca role dalam team',
    name: 'allow_read_roles',
    value: 'allow_read_roles',
  },
  {
    desc: 'Perbolehkan user untuk membaca billing team',
    name: 'allow_read_billing',
    value: 'allow_read_billing',
  },
  {
    desc: 'Perbolehkan user untuk mengedit dan membaca user lain',
    name: 'allow_read & write_members',
    value: 'allow_write_members',
  },
  {
    desc: 'Perbolehkan user untuk mengedit dan membaca team',
    name: 'allow_read & write_team',
    value: 'allow_write_team',
  },
  {
    desc: 'Perbolehkan user untuk mengedit dan membaca profile',
    name: 'allow_read & write_profile',
    value: 'allow_write_profile',
  },
  {
    desc: 'Perbolehkan user untuk membuat dan membaca team records',
    name: 'allow_read & write_records',
    value: 'allow_write_records',
  },
  {
    desc: 'Perbolehkan user untuk membuat dan membaca role dalam team',
    name: 'allow_read & write_roles',
    value: 'allow_write_roles',
  },
  {
    desc: 'Perbolehkan user untuk membuat dan membaca billing team',
    name: 'allow_read & write_billing',
    value: 'allow_write_billing',
  },
  {
    desc: 'Perbolehkan user untuk mengedit dan membaca koneksi team',
    name: 'allow_read & write_connections',
    value: 'allow_write_connections',
  },
  {
    desc: 'Perbolehkan user untuk melihat dan membaca profile',
    name: 'allow_read_profile',
    value: 'allow_read_profile',
  },
];

export default roleMapping;
