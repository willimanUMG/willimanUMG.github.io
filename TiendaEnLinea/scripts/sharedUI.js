class GeneralHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <header>
        <h1>Empresa "Online Shop"</h1>        
    </header>    
    `;
  }
}

class GeneralFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <footer>
      <p>
        Avenida del Emprendimiento, Zona del Soñador 
        Ciudad de Guatemala
        &copy;2022 Online Shop - Todos los derechos reservados 
        Contáctenos: ventas@onlineShop.com
      </p>
    </footer>`;
  }
}

customElements.define("general-header", GeneralHeader);
customElements.define("general-footer", GeneralFooter);

// const template = document.createElement("template");
// template.innerHTML = `
//     <header>
//         <h1>Empresa "Online Shop"</h1>
//     </header>

// `;

// document.body.appendChild(template.content);
