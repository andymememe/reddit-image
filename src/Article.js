import React from 'react';

function Article(props) {
    var ele = null
    if (props.url) {
        if(props.url.includes("imgur") &&
           !(props.url.includes("gifv")) &&
           !(props.url.includes("/a/")) &&
           !(props.url.includes("gallery"))) {
            ele = <img alt={props.content}
                       src={props.url}
                       crossOrigin="anonymous"/>;
        }
        else if (props.url.includes("gfycat")) {
            var urlEle = props.url.split("/")
            var id = urlEle.slice(-1).pop()
            var styleDiv = {
                position: 'relative',
                paddingBottom: 'calc(50%)'
            };
            var styleIF = {
                position: 'absolute',
                top:0,
                left: '25%'
            }
            ele = <div style={styleDiv}>
                    <iframe title={id} src={'https://gfycat.com/ifr/' + id}
                            frameBorder='0'
                            scrolling='no'
                            width='700px'
                            height='640px'
                            style={styleIF}
                            allowFullScreen>
                    </iframe>
                  </div>
        }
        else if (props.content !== "") {
            ele = <p>{props.content}</p>
        }
    }
    
    return(
        <div id="article">
            <h2><a href={props.rawurl}>{props.title}</a></h2>
            {ele}
            <p><a href={props.url}>Link</a></p>
        </div>
    )
}

class Articles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rsobj: {},
            subreddit: null,
            isLoaded: false,
            error: null,
            next: null
        };
    }

    componentDidMount() {
        this.setState({
            subreddit: this.props.subreddit
        });
    }
  
    componentDidUpdate(prevProps, prevState) {
        var url = ""
        if (this.props.subreddit !== prevProps.subreddit)
        {
            this.setState({
                isLoaded: false,
                subreddit: this.props.subreddit
            });
        }
        else if (this.state.subreddit !== prevState.subreddit)
        {
            url = "https://www.reddit.com/r/" +
                  this.props.subreddit +
                  "/hot/.json"
        }
        else if (this.state.next) {
            url = "https://www.reddit.com/r/" +
                  this.props.subreddit +
                  "/hot/.json?after=" +
                  prevState.rsobj.after
        }
        if (url !== "") {
            console.log(url)
            fetch(url)
              .then(res => res.json())
              .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        rsobj: result.data,
                        subreddit: this.props.subreddit,
                        next: false
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error: error,
                        next: false
                    });
                })
        }
    } 

  render() {
    const rsobj = this.state.rsobj;
    const subreddit = this.state.subreddit;
    const isLoaded = this.state.isLoaded;
    const error = this.state.error;
    if (error) {
        return <div>Error: {error.message}</div>;
    }
    else if (!isLoaded) {
        return <div>Loading...</div>;
    }
    else {
        var rows = []
        var buttonPrevious = null
        var buttonNext = null
        
        if(rsobj) {
            rsobj.children
                .filter(ele => ele.data.url)
                .forEach(function(ele){
                    rows.push(<Article key={ele.data.name}
                                       title={ele.data.title}
                                       url={ele.data.url}
                                       content={ele.data.selftext}
                                       rawurl={"http://www.reddit.com" +
                                               ele.data.permalink}/>)
                })
            if (rsobj.after) {
                const handleNext = _ => {
                    this.setState({
                        isLoaded: false,
                        subreddit: subreddit,
                        next: true,
                        previous: false
                    });
                }
                buttonNext = <button id='next' onClick={handleNext}>
                                Next
                             </button>
            }
            return(
                <div>
                    {rows}
                    {buttonPrevious}
                    {buttonNext}
                </div>
            );
        }
        else {
            return (
                <div><h2>Error</h2><p>Subreddit unavailable!</p></div>
            )
        }
    }
  }
}


export default Articles;