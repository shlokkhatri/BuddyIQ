interface Props {
  subjects: string[];
  value: string;
  onChange: (value: string) => void;
}

export default function SubjectSelector({
  subjects,
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="font-semibold text-slate-700">
        Subject
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border p-3"
      >
        <option value="">Select Subject</option>

        {subjects.map((subject) => (
          <option key={subject} value={subject}>
            {subject}
          </option>
        ))}
      </select>
    </div>
  );
}