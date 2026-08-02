import { motion } from "framer-motion";
import MemberCard from "../components/committee/MemberCard";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../api/axiosClient";

const Committee = () => {
  const {
    data: committee,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["committee"],
    queryFn: async () => {
      const { data } = await axiosClient.get("/committee");
      return data;
    },
  });

  return (
    <div className="w-full bg-[#F4F1EA] dark:bg-[#070E0B] min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute -top-40 -right-20 w-[550px] h-[550px] rounded-full bg-[#3DB86B]/07 dark:bg-[#3DB86B]/05 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full bg-[#C97B4E]/05 dark:bg-[#C97B4E]/04 blur-[110px]" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-20 text-center"
        >
          <h1
            className="text-5xl md:text-6xl font-extrabold text-[#1F3E2F] dark:text-white mb-6 tracking-tight relative inline-block"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            Our <span className="text-[#3DB86B]">Committee</span>
          </h1>
          <p className="text-[#5B7566] dark:text-[#9CB3A6] max-w-2xl mx-auto text-lg font-medium mt-4">
            The dedicated minds behind Srishtipadham, working together to
            preserve and promote our literary heritage.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 gap-y-16">
          {isLoading ? (
            <div className="col-span-full text-center text-[#9CB3A6] py-12">
              Loading committee...
            </div>
          ) : error ? (
            <div className="col-span-full text-center text-red-400 py-12">
              Failed to load committee.
            </div>
          ) : (
            committee
              ?.sort((a: any, b: any) => a.order - b.order)
              .map((member: any, idx: number) => (
                <MemberCard key={member._id} member={member} index={idx} />
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Committee;
