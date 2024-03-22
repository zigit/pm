import React from 'react';
import appConfig from './native/appConfig';
import fitext from 'fitext'


class Popup extends React.Component {
  constructor(props) {
    super(props);
    
    // Initialize state with props
    this.state = { 
      isVisible: this.props.isVisible || false,  // Using props with a fallback to true
      text: this.props.text || ""  // Using props with a fallback text
    };

    this.handleResize = this.handleResize.bind(this);
    this.handleClick = this.handleClick.bind(this);
    appConfig.on('setPopupVisibilityAndText', this.setPopupVisibilityAndText.bind(this));
  }

  handleClick() {
    document.getElementById('popupFrame').addEventListener('transitionend', event => {
        this.setState({ isVisible: false ,text: ''});
        //this.setFontSize();
    });
    setTimeout(() => {
        document.getElementById('popupFrame').classList.remove('frame-visible');
      }, 500);    
  }

  handleResize() {
    fitext({wideable:true})
  }

  setPopupVisibilityAndText(e) {
    this.setState({
      isVisible: true,
      text: e.text
    });
    document.getElementById('popupFrame').addEventListener('transitionend', event => {
      fitext({wideable:true})
    });
    setTimeout(() => {
      document.getElementById('popupFrame').classList.add('frame-visible');
    }, 500);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }  

  // Add componentDidUpdate to update state when props change
  componentDidUpdate(prevProps) {
    if (prevProps.isVisible !== this.props.isVisible) {
      this.setState({ isVisible: this.props.isVisible });
    }
    if (prevProps.text !== this.props.text) {
      this.setState({ text: this.props.text });
    }
    fitext({wideable:true})
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    if (!this.state.isVisible) {
      return null;
    }

    return (
        <div className="frame" id="popupFrame">
          <div className="close" id="closePopupFrame" onClick={this.handleClick}><span className='glyphicon glyphicon-remove'></span></div>
          <div className="text fit-this-text">
            <div className='fitter'>
              {this.state.text}
            </div>
          </div>
        </div>
    );

  }
}

export default Popup;