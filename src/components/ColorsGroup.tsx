import { ChangeEvent } from "react";

type Props = {
  title: string;
  values: string;
  options: { name: string; value: string; color: string }[];
  onChange: (value: string) => void;
};

export default function ColorsGroup({ values, options, title, onChange }: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <>
      <div className="mb-2 text-lg">{title}</div>
      <div className="flex flex-wrap">
        {options.map((option, index) => (
          <div className="mb-2" key={index}>
            <label htmlFor={option.name} key={index} title={option.name}>
              <input
                checked={values.includes(option.value)}
                className={`me-2 h-6 w-6 rounded border-[${option.color}] focus:ring-[${option.color}]`}
                id={option.name}
                style={{ backgroundColor: option.color }}
                type="radio"
                value={option.value}
                onChange={handleChange}
              />
            </label>
          </div>
        ))}
      </div>
    </>
  );
}
