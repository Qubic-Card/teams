export interface IMembership {
  UID: string;
  Membership: {
    TID: string;
    Points: number;
    JoinedAt: string;
    AddedBy: string;
    Profile: {
      Firstname: string;
      Lastname: string;
      Job: string;
      Email: string;
    }
  }
}

export interface ITenant {
  TID: string;
  Metadata: {
    Name: string;
    PointName: string;
    Logo: string;
    isPrivate: boolean;
  }
}

export interface ITeam {
  TeamID: string;
  Tenants: ITenant[];
}

export const membership: IMembership[] = [
  {
    UID: '1',
    Membership: {
      TID: '1',
      Points: 100,
      JoinedAt: '2018-01-01',
      AddedBy: 'galih',
      Profile: {
        Firstname: 'John Doe',
        Lastname: 'John Doe',
        Job: 'FE Developer',
        Email: 'john@gmail.com',
      },
    },
  },
  {
    UID: '2',
    Membership: {
      TID: '1',
      Points: 100,
      JoinedAt: '2018-01-01',
      AddedBy: 'galih',
      Profile: {
        Firstname: 'Doe',
        Lastname: 'Doe',
        Job: 'BE Developer',
        Email: 'qwerty@gmail.com',
      },
    },
  },
  {
    UID: '3',
    Membership: {
      TID: '2',
      Points: 100,
      JoinedAt: '2018-01-01',
      AddedBy: 'galih',
      Profile: {
        Firstname: 'John',
        Lastname: 'John',
        Job: 'QA',
        Email: 'pooooo@gmail.com',
      },
    },
  },
];

export const tenants: ITeam[] = [
  {
    TeamID: '3',
    Tenants: [{
      TID: '1',
      Metadata: {
        Name: 'Team 1',
        PointName: 'Point',
        Logo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
        isPrivate: false,
      }
    }, {
      TID: '2',
      Metadata: {
        Name: 'Team 2',
        PointName: 'Point',
        Logo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
        isPrivate: false,
      }
    }],
  },
];
