import { useState } from "react";
import { BikeType } from "../utils/bikeType";

function BikeForm({ formData, handleSubmit }) {
  const [formular, setFormular] = useState(formData);

  function inputHandler(e) {
    setFormular((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  }

  return (
    <form className="w-full max-w-lg">
      <div className="flex flex-wrap -mx-3 my-6">
        <div className="w-full md:w-1/2 px-3">
          <label
            htmlFor="model"
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          >
            Model
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            type="text"
            placeholder="Giant Trance 2"
            id="model"
            value={formular?.model}
            name="model"
            onChange={inputHandler}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="type"
          >
            Type
          </label>
          <div className="relative">
            <select
              value={formular?.type}
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="type"
              name="type"
              onChange={inputHandler}
            >
              <option value={""}>Choose type</option>
              {Object.values(BikeType).map((type, index) => {
                return (
                  <option key={index} value={type}>
                    {type}
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            cols={40}
            rows={10}
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="description"
            placeholder="Make it as long and as crazy as you'd like"
            value={formular?.description}
            name="description"
            onChange={inputHandler}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full px-3 mb-6 md:mb-0">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="image-link"
          >
            Image Link
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="image-link"
            type="text"
            placeholder="Choose a nice picture of your bike"
            value={formular?.imageUrl}
            name="imageUrl"
            onChange={inputHandler}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 my-6">
        <div className="w-full px-3">
          <label
            htmlFor="location"
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          >
            Location
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            type="text"
            placeholder="City"
            id="location"
            value={formular?.city}
            name="city"
            onChange={inputHandler}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 my-6">
        <div className="w-full md:w-1/2 px-3">
          <label
            htmlFor="combination"
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          >
            Combination
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            type="password"
            placeholder="Combination of bicycle lock"
            id="combination"
            value={formular?.combination}
            name="combination"
            onChange={inputHandler}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label
            htmlFor="price"
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          >
            Price
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            type="text"
            placeholder="Price"
            id="price"
            value={formular?.price}
            name="price"
            onChange={inputHandler}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          handleSubmit(formular);
        }}
        className="mt-4 py-2 px-4 bg-[#D58EB0] hover:bg-[#8E2F5C] hover:text-white rounded"
      >
        List bike
      </button>
    </form>
  );
}

export default BikeForm;
