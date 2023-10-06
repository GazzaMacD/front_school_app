import { Link } from "@remix-run/react";
import { AiOutlineCalendar, AiOutlineClockCircle } from "react-icons/ai";

export default function ContactTelephonePage() {
  return (
    <div className="frco-tel">
      <a className="frco-tel__number" href="tel:0561-42-5707">
        0561-42-5707
      </a>
      <h3>お問い合わせ受付時間</h3>
      <ul className="frco-tel__times">
        <li className="frco-tel__time">
          <AiOutlineCalendar />
          <span>火曜日</span>
          <AiOutlineClockCircle />
          <span>13:00 - 17:00</span>
        </li>
        <li className="frco-tel__time">
          <AiOutlineCalendar />
          <span>水曜日</span>
          <AiOutlineClockCircle />
          <span>09:00 - 17:00</span>
        </li>
        <li className="frco-tel__time">
          <AiOutlineCalendar />
          <span>木曜日</span>
          <AiOutlineClockCircle />
          <span>13:00 – 17:00</span>
        </li>
        <li className="frco-tel__time">
          <AiOutlineCalendar />
          <span>金曜日</span>
          <AiOutlineClockCircle />
          <span>13:00 – 17:00</span>
        </li>
        <li className="frco-tel__time">
          <AiOutlineCalendar />
          <span>土曜日</span>
          <AiOutlineClockCircle />
          <span>08:00 – 12:00</span>
        </li>
        <li>
          <span>日曜・月曜および祝祭日はお休みとさせていただきます</span>
        </li>
      </ul>
      <p>
        Prefer to contact us by{" "}
        <Link to="/contact/form#contact">mail contact form</Link>?{" "}
      </p>
    </div>
  );
}
