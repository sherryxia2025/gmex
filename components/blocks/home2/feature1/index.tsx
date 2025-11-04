import { ClipText } from "@/components/clip-text";

export const Feature1 = () => {
  return (
    <div className="h-90 md:h-150 w-full flex items-center justify-center bg-white">
      <ClipText
        image="/images/comment1.png"
        className="whitespace-nowrap text-[100px] md:text-[247px]"
      >
        Metary
      </ClipText>
    </div>
  );
};
