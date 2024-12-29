const RenderFooter = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="py-3 text-center text-sm text-muted-foreground">
            <p className="flex flex-wrap items-center justify-center">
                &copy; {currentYear}&nbsp; 
                <a className="text-blue-600">Enaiblr</a>.
                {" "}
                All rights reserved. | 
                {" "}
                <a href="mailto:enaiblr@gmail.com" target="_blank" rel="noopener noreferrer">&nbsp;Report a Bug</a>
            </p>
        </footer>
    )
};

export default RenderFooter;
