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
      <label className="mb-2 text-lg" htmlFor={`${title}-group`}>
        {title}
      </label>
      <div className="flex flex-wrap" id={`${title}-group`}>
        {options.map((option, index) => (
          <div className="mb-2" key={index}>
            <label htmlFor={`${title}-${option.value}`} title={option.name}>
              <input
                checked={values.includes(option.value)}
                className={`me-2 h-6 w-6 rounded border-[${option.color}] focus:ring-[${option.color}]`}
                id={`${title}-${option.value}`}
                name={title}
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
