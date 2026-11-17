import { MatchupForm } from "@/components/MatchupForm";
import { getAllHeroStats } from "@/lib/hero-data";

const Home = () => {
  const heroes = getAllHeroStats().sort((a, b) =>
    a.localized_name.localeCompare(b.localized_name),
  );

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <MatchupForm heroes={heroes} />
    </main>
  );
};

export default Home;
