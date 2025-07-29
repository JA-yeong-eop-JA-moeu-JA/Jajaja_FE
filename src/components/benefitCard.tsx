type TBenefitCardProps = {
  content: string;
};

export default function BenefitCard({ content }: TBenefitCardProps) {
  return (
    <div className="w-full bg-black-0 text-black rounded-lg py-5 px-2.5 text-body-regular">
      <p className="w-25 h-10 text-center">{content}</p>
    </div>
  );
}
