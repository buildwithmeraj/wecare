import React from "react";
import { FaFolderClosed } from "react-icons/fa6";
import { ImCancelCircle } from "react-icons/im";
import { WiStars } from "react-icons/wi";
import { MdClear, MdPostAdd } from "react-icons/md";
import Link from "next/link";
const AddService = () => {
  return (
    <div className="max-w-3xl mx-auto bg-base-100 rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-6">Add New Post</h1>

      {error && (
        <div className="alert alert-error alert-soft mb-6">
          <ImCancelCircle />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-6">
        <div className="w-full">
          <label className="label">
            <span className="label-text font-semibold">Title</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            required
            onChange={handleInputChange}
            placeholder="Enter post title"
            className="input input-bordered w-full"
            disabled={isSubmitting || isUploading}
          />
        </div>

        <div className="w-full relative" ref={dropdownRef}>
          <label className="label">
            <span className="label-text font-semibold">Category</span>
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(true)}
            required
            placeholder="Type or select a category"
            className="input input-bordered w-full"
            disabled={isSubmitting || isUploading}
          />

          {showDropdown && filteredCategories.length > 0 && (
            <ul className="absolute z-10 bg-base-100 border border-base-300 rounded-lg mt-1 max-h-48 overflow-y-auto w-full shadow-lg">
              {filteredCategories.map((cat) => (
                <li
                  key={cat._id}
                  onClick={() => handleCategorySelect(cat.name)}
                  className="px-4 py-2 hover:bg-base-200 cursor-pointer flex items-center gap-2"
                >
                  <FaFolderClosed className="mb-0.5" />
                  {cat.name}
                </li>
              ))}
            </ul>
          )}

          {formData.category &&
            filteredCategories.length === 0 &&
            showDropdown && (
              <div role="alert" className="alert alert-info alert-soft mt-3">
                <span>
                  <WiStars className="inline text-2xl" />
                  New category "{formData.category}" will be created
                </span>
              </div>
            )}
        </div>

        <div className="w-full">
          <label className="label">
            <span className="label-text font-semibold">Content</span>
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            placeholder="Write your post content here..."
            className="textarea textarea-bordered h-64 w-full"
            disabled={isSubmitting || isUploading}
          />
        </div>

        <div className="w-full">
          <label className="label">
            <span className="label-text font-semibold">Featured Image</span>
          </label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full"
            disabled={isSubmitting || isUploading}
          />

          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              isUploading ||
              !formData.title.trim() ||
              !formData.category.trim() ||
              !formData.content.trim()
            }
            className="btn btn-primary flex-1"
          >
            <MdPostAdd className="text-lg mb-0.5" />
            {isUploading
              ? "Uploading Image..."
              : isSubmitting
              ? "Creating Post..."
              : "Create Post"}
          </button>
          <Link
            href="/my-posts"
            onClick={() => router.back()}
            className="btn btn-error bg-error/80"
            disabled={isSubmitting || isUploading}
          >
            <MdClear className="text-lg" />
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AddService;
