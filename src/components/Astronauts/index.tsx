import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ArrowUp from "../../assets/arrow-up.svg";
import ArrowDown from "../../assets/arrow-down.svg"
import CrewIcon from "../../assets/crew-icon.svg"

type Astronaut = {
  craft: string,
  name: string,
};

const Astronauts = () => {
  const { data: issCrewMember = [], isLoading, isError } = useQuery<string[]>({
      queryKey:["astronauts"], 
      queryFn: async () => {
          const response = await fetch("http://api.open-notify.org/astros.json");
          const astronauts = await response.json();
          return astronauts.people
          .filter((astronaut: Astronaut) => astronaut.craft === "ISS")
          .map((astronaut: Astronaut) => astronaut.name);
      }
  });
  
  useEffect(() => {
      setShowCrew(false);
  }, [issCrewMember]);
  
  const [showCrew, setShowCrew] = useState<boolean>(false);

  return (
    <section className="shadow-[inset_1px_0.1px_2px_rgba(250,250,250,0.5)] flex flex-col z-10 text-white bg-[color:var(--menu-blue)] rounded-tr-xl lg:text-sm lg:shadow-none lg:rounded-tr-none">
      <div
        onClick={() => setShowCrew(!showCrew)}
        className={`cursor-pointer p-4 pl-2 flex justify-between border-b-[color:var(--menu-divider-blue)] border-b border-b-solid border-l-8 border-l-solid" ${showCrew ? "border-l-[color:var(--menu-select-blue)]" : "border-l-[color:var(--menu-divider-blue)]"}`}
      >
        <div className="flex">
          <img className="w-5 mr-2" src={CrewIcon} alt="crew icon" />
          <p className="font-bold">Current ISS crew</p>
        </div>
        <img className="w-5 ml-4" src={showCrew ? ArrowUp : ArrowDown} alt="collapse menu" />
      </div>
      {showCrew && (
        <ul className="animate-grow border-b-[color:var(--menu-divider-blue)] border-b border-b-solid p-4 flex flex-col gap-1 text-sm bg-[color:var(--menu-expanded-blue)] lg:border-none">
          {isLoading ? (
            <li>Loading...</li>
          ) : isError ? (
            <li>Error: Unable to fetch astronauts data</li>
          ) : (
            issCrewMember.map((crewMember: string, index: number) => (
              <li className="font-medium text-sm lg:text-xs" key={index}>
                {crewMember}
              </li>
            ))
          )}
        </ul>
      )}
    </section>
  );
};

export default Astronauts;