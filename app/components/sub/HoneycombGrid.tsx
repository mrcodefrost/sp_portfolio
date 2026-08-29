"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import SkillDataProvider from "./SkillDataProvider";

interface SkillItem {
  skill_name: string;
  Image: string;
  width: number;
  height: number;
}

const HEX_WIDTH = 66;
const HEX_HEIGHT = 76;
const ROW_PITCH = 57; // 0.75 * HEX_HEIGHT, the exact spacing for gap-free hex tessellation
const ITEMS_PER_ROW = 6;

const chunk = <T,>(arr: T[], size: number): T[][] => {
  const rows: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    rows.push(arr.slice(i, i + size));
  }
  return rows;
};

const HoneycombGrid = ({ skills }: { skills: SkillItem[] }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const rows = chunk(skills, ITEMS_PER_ROW);
  const gridWidth = ITEMS_PER_ROW * HEX_WIDTH + HEX_WIDTH / 2;

  return (
    <div ref={ref} className="w-full">
      <div className="mx-auto" style={{ width: gridWidth }}>
        {rows.map((rowSkills, rowIndex) => {
          const offsetRow = rowIndex % 2 === 1;
          return (
            <div
              key={rowIndex}
              className="flex"
              style={{
                marginLeft: offsetRow ? HEX_WIDTH / 2 : 0,
                marginTop: rowIndex > 0 ? -(HEX_HEIGHT - ROW_PITCH) : 0,
              }}
            >
              {rowSkills.map((skill, i) => (
                <SkillDataProvider
                  key={skill.skill_name}
                  src={skill.Image}
                  width={skill.width}
                  height={skill.height}
                  index={rowIndex * ITEMS_PER_ROW + i}
                  name={skill.skill_name}
                  inView={inView}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HoneycombGrid;
