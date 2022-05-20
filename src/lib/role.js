const roleMapping = [
  {
    id: 1,
    checked: false,
    desc: 'Perbolehkan user untuk membaca user lain',
    name: 'allow_read_members',
  },
  {
    id: 2,
    checked: false,
    desc: 'Perbolehkan user untuk membaca team',
    name: 'allow_read_team',
  },
  {
    id: 3,
    checked: false,
    desc: 'Perbolehkan user untuk membaca analytics',
    name: 'allow_read_analytics',
  },
  {
    id: 4,
    checked: false,
    desc: 'Perbolehkan user untuk mengedit user lain',
    name: 'allow_write_members',
  },
  {
    id: 5,
    checked: false,
    desc: 'Perbolehkan user untuk mengedit team',
    name: 'allow_write_team',
  },
  {
    id: 6,
    checked: false,
    desc: 'Perbolehkan user untuk mengedit profile',
    name: 'allow_write_profile',
  },
];

export default roleMapping;
