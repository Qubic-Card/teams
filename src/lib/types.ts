export type RolesModel = { id: number, created_at: string, role_maps: [string], role_name: string, team_id: number }

export type memberModel = { team_profile: [{ avatar: string, company: string, design: {}, firstname: string, job: string, lastname: string, links: [], socials: [] }], uid: string }