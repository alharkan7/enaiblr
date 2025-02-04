const AppsFooter = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="py-3 text-center text-sm text-muted-foreground">
            <p className="flex flex-wrap items-center justify-center">
                &copy; {currentYear}&nbsp; 
                <a className="text-primary hover:text-primary/90">Enaiblr</a>.
                {" "}
                All rights reserved.
                {/* {" | "}
                <a href="mailto:mail@enaiblr.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/90">&nbsp;Report a Bug</a> */}
            </p>
        </footer>
    )
};

export default AppsFooter;
