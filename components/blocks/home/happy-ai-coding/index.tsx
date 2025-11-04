interface HappyAiCodingProps {
  title?: string;
  buttonText?: string;
  buttonHref?: string;
}

export default function HappyAiCoding(props: HappyAiCodingProps) {
  const { title, buttonText, buttonHref } = props;

  return (
    <section className="w-full h-auto flex flex-col items-center justify-center gap-10 sm:gap-15 py-16 sm:py-25 px-4">
      <div className="plus-jakarta-sans text-2xl sm:text-3xl md:text-4xl font-bold text-[#3D3D3D] dark:text-[#EDEDED] text-center">
        {title}
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4 justify-items-center">
        <img
          src="/images/happy-coding/cursor.png"
          alt="cursor"
          className="size-16 sm:size-12"
        />
        <img
          src="/images/happy-coding/copilot.png"
          alt="copilot"
          className="size-16 sm:size-12"
        />
        <img
          src="/images/happy-coding/claude.png"
          alt="claude"
          className="size-16 sm:size-12"
        />
        <img
          src="/images/happy-coding/gpt.png"
          alt="chatgpt"
          className="size-16 sm:size-12"
        />
        <img
          src="/images/happy-coding/windsurf.png"
          alt="windsurf"
          className="size-16 sm:size-12"
        />
        <img
          src="/images/happy-coding/gemini.png"
          alt="gemini"
          className="size-16 sm:size-12"
        />
        <img
          src="/images/happy-coding/grok.png"
          alt="grok"
          className="size-16 sm:size-12"
        />
        <img
          src="/images/happy-coding/deepseek.png"
          alt="deepseek"
          className="size-16 sm:size-12"
        />
      </div>
      {buttonHref ? (
        <a
          href={buttonHref}
          className="font-medium px-6 py-3 md:px-8 md:py-4 w-auto md:w-45 bg-[#F14636] rounded-lg text-white cursor-pointer hover:bg-[#F14636]/80 transition-colors"
        >
          {buttonText}
        </a>
      ) : (
        <button
          type="button"
          className="font-medium px-6 py-3 md:px-8 md:py-4 w-auto md:w-45 bg-[#F14636] rounded-lg text-white cursor-pointer hover:bg-[#F14636]/80 transition-colors"
        >
          {buttonText}
        </button>
      )}
    </section>
  );
}
