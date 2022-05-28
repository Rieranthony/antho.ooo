import Link from "next/link";
import Image from "next/image";

function SimpleLink({
  url,
  icon,
  alt
}: {
  url: string;
  icon: string;
  alt: string;
}) {
  return (
    <Link href={url}>
      <a className="px-2">
        <Image src={icon} alt={alt} width={22.76} height={16} />
      </a>
    </Link>
  );
}

export function SocialBar() {
  return (
    <div className="flex justify-between p-2">
      <SimpleLink
        url="https://www.youtube.com/channel/UCvjRCspZdRy1NMqyh_7BKyQ"
        icon="/icons/youtube.svg"
        alt="youtube icon"
      />
      <SimpleLink
        url="https://twitter.com/_anthonyriera"
        icon="/icons/twitter.svg"
        alt="twitter icon"
      />
      <SimpleLink
        url="https://www.instagram.com/_anthony.riera/?hl=en"
        icon="/icons/instagram.svg"
        alt="instagram icon"
      />
      <SimpleLink
        url="mailto:hey@antho.ooo"
        icon="/icons/email.svg"
        alt="email icon"
      />
      <SimpleLink
        url="https://etherscan.io/address/anthonyriera.eth"
        icon="/icons/eth.svg"
        alt="eth icon"
      />
    </div>
  );
}
