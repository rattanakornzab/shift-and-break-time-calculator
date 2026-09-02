import { Info } from 'lucide-react';

export default function HelpGuide() {
  return (
    <div className="rounded-2xl bg-blue-50/70 p-4 ring-1 ring-blue-100 transition-colors duration-300 dark:bg-blue-950/30 dark:ring-blue-900/50 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Info className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
            วิธีใช้งานแอปพลิเคชัน
          </h3>
          <ul className="mt-2 space-y-1.5 text-sm text-blue-800/90 dark:text-blue-300/80">
            <li>
              <strong>1.</strong> กรอกชื่อพนักงาน เลือกประเภทและตำแหน่ง
              (เลือกจากรายการหรือพิมพ์เองได้)
            </li>
            <li>
              <strong>2.</strong> ระบุเวลาเข้างาน ชั่วโมงกะงาน (0.5–24 ชม.)
              และเวลาพักเป็นนาที
            </li>
            <li>
              <strong>3.</strong> กดปุ่ม &quot;คำนวณและบันทึก&quot;
              ระบบจะคำนวณเวลาเลิกงานอัตโนมัติและเพิ่มลงตาราง
            </li>
            <li>
              <strong>4.</strong> สถานะการทำงานอัปเดตเรียลไทม์ทุกวินาที
              — เขียว = กำลังทำงาน, ฟ้า = ยังไม่ถึงเวลา, เทา = เลิกงานแล้ว
            </li>
            <li>
              <strong>5.</strong> ใช้ช่องค้นหาเพื่อกรองรายชื่อ
              และกดไอคอนถังขยะเพื่อลบรายการที่ไม่ต้องการ
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
