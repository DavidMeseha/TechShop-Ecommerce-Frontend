import React, { ChangeEvent } from "react";

type Props = {
  title: string;
  values: string;
  options: { name: string; value: string; image: string }[];
  onChange: (value: string) => void;
};

export default function TextureGroup({ values, options, title, onChange }: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="px-6">
      <div className="mb-2 text-lg">{title}</div>
      <div className="flex flex-wrap">
        {options.map((option, index) => (
          <div className="mb-2" key={index}>
            <label htmlFor={option.name} key={index} title={option.name}>
              <input
                checked={values.includes(option.value)}
                className={`me-2 h-10 w-10 rounded-none border-red-300 text-primary focus:ring-red-200`}
                id={option.name}
                type="radio"
                value={option.value}
                style={{
                  backgroundImage: `url('${option.image}')`,
                  backgroundSize: "33px 33px",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center"
                }}
                onChange={handleChange}
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
