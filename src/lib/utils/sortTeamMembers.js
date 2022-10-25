const sortTeamMember = (members) => {
  let emptyLogs = [];
  let nonEmptyLogs = [];

  members.map((member) => {
    if (member.team_logs.length > 0) {
      nonEmptyLogs.push(member);
    } else {
      emptyLogs.push(member);
    }
  });

  let sortedDate = nonEmptyLogs
    .map((m) => m.team_logs[0].created_at)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let sortedMembers = [];

  sortedDate.map((date) => {
    let member = nonEmptyLogs.find((m) => m.team_logs[0].created_at === date);
    sortedMembers.push(member);
  });

  return [...sortedMembers, ...emptyLogs];
};

export default sortTeamMember;
