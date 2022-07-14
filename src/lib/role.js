const roleMapping = [
  {
    desc: 'Dapat mengakses semua fitur',
    name: 'super_admin',
  },
  {
    desc: 'Perbolehkan user untuk membaca user lain',
    name: 'allow_read_members',
  },
  {
    desc: 'Perbolehkan user untuk membaca team',
    name: 'allow_read_team',
  },
  {
    desc: 'Perbolehkan user untuk membaca analytics',
    name: 'allow_read_analytics',
  },
  {
    desc: 'Perbolehkan user untuk membaca user lain',
    name: 'allow_read_connections',
  },
  {
    desc: 'Perbolehkan user untuk membaca role dalam team',
    name: 'allow_read_roles',
  },
  {
    desc: 'Perbolehkan user untuk membaca billing team',
    name: 'allow_read_billing',
  },
  {
    desc: 'Perbolehkan user untuk mengedit user lain',
    name: 'allow_write_members',
  },
  {
    desc: 'Perbolehkan user untuk mengedit team',
    name: 'allow_write_team',
  },
  {
    desc: 'Perbolehkan user untuk mengedit profile',
    name: 'allow_write_profile',
  },
  {
    desc: 'Perbolehkan user untuk membuat team records',
    name: 'allow_write_records',
  },
  {
    desc: 'Perbolehkan user untuk membuat role dalam team',
    name: 'allow_write_roles',
  },
  {
    desc: 'Perbolehkan user untuk membuat billing team',
    name: 'allow_write_billing',
  },
];

export default roleMapping;
