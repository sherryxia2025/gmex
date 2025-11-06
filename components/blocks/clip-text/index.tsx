import { ClipText } from "@/components/clip-text";

interface ClipTextSectionProps {
  text?: string;
  image?: string;
}

export const ClipTextSection = ({
  text = "GEMX",
  image = "/images/comment1.png",
}: ClipTextSectionProps) => {
  return (
    <div className="h-90 md:h-150 w-full flex items-center justify-center bg-white">
      <ClipText
        image={image}
        className="whitespace-nowrap text-[100px] md:text-[247px]"
      >
        {text}
      </ClipText>
    </div>
  );
};
