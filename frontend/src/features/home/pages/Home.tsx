import "../css/home.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";

export default function Home() {
    const { isAuthenticated } = useAuth();

    return (
        <main className="home-container">

            {/* HERO */}
            <section className="home-hero">

                <div className="hero-content">

                    <h1>Velox Wrap</h1>

                    <p>
                        Transforme seu veículo com estilo,
                        proteção e personalidade.
                    </p>

                    {isAuthenticated ? (
                        <div className="hero-buttons">
                            <Link
                                to="/profile"
                                className="home-btn home-btn-primary"
                            >
                                Meu Perfil
                            </Link>

                            <Link
                                to="/modelos"
                                className="home-btn home-btn-outline"
                            >
                                Ver Modelos
                            </Link>
                        </div>
                    ) : (
                        <div className="hero-buttons">
                            <Link
                                to="/login"
                                className="home-btn home-btn-outline"
                            >
                                Entrar
                            </Link>

                            <Link
                                to="/register"
                                className="home-btn home-btn-primary"
                            >
                                Começar Agora
                            </Link>
                        </div>
                    )}

                </div>

            </section>

            {/* SERVIÇOS */}
            <section id="servicos" className="servicos">

                <div className="servicos-grid">

                    <div className="servico-card">

                        <i className="fas fa-paint-roller"></i>

                        <h3>Envelopamento Líquido</h3>

                        <p>
                            Cor nova sem danificar a pintura.
                        </p>

                    </div>

                    <div className="servico-card">

                        <i className="fas fa-film"></i>

                        <h3>Película PPF</h3>

                        <p>
                            Proteção invisível contra riscos.
                        </p>

                    </div>

                    <div className="servico-card">

                        <i className="fas fa-tools"></i>

                        <h3>Personalização Total</h3>

                        <p>
                            Tudo do seu jeito.
                        </p>

                    </div>

                </div>

            </section>

        </main>
    );
}