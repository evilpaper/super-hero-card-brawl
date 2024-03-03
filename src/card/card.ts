type CardType = {
  suite: string;
};

export function Card(suite: string): CardType {
  return {
    suite: suite,
  };
}
