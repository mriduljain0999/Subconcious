interface RedirectInterface {
    onTouch: string; // URL for redirection
  }
  
  export function Redirect(props: RedirectInterface) {
    return (
      <a href={props.onTouch} target="_blank" rel="noopener noreferrer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-5 cursor-pointer text-[#75797f] hover:text-black dark:hover:text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
          ></path>
        </svg>
      </a>
    );
  }
  