import {
  Backend_skill,
  Frontend_skill,
  Other_skill,
} from "@/constants";
import SkillText from "../sub/SkillText";
import HoneycombGrid from "../sub/HoneycombGrid";
import GithubActivity from "../sub/GithubActivity";

const ALL_SKILLS = [...Frontend_skill, ...Backend_skill, ...Other_skill];

const Skills = () => {
  return (
    <section
      id="skills"
      className="flex flex-col items-center justify-center gap-3 relative py-20 z-[20]"
    >
      <SkillText />

      <div className="relative z-[20] w-full max-w-4xl px-6 md:px-10 flex flex-col items-center">
        <div className="py-4">
          <HoneycombGrid skills={ALL_SKILLS} />
        </div>
        <div className="w-full mt-8">
          <GithubActivity />
        </div>
      </div>
    </section>
  );
};

export default Skills;
