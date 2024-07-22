export interface Vote {
  id: number;
  title: string;
  options: string[];
  multipleChoice: boolean;
}

let votes: Vote[] = [];

export const createVote = (vote: Omit<Vote, 'id'>): Vote => {
  const newVote: Vote = {
    id: generateUniqueId(),
    ...vote,
  };
  votes.push(newVote);
  return newVote;
};

export const getVotes = (): Vote[] => {
  return votes;
};

export const getVoteById = (id: number): Vote | undefined => {
  return votes.find((vote) => vote.id === id);
};


const generateUniqueId = (): number => {
  return new Date().getTime();
};
