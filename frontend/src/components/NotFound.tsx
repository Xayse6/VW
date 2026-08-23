
import { Link } from 'react-router-dom';

export function NotFound(){
  return (
    <div className="page page--center">
      <h1>404</h1>
      <p>Página não encontrada.</p>
      <Link to="/" className="btn btn--primary">
        Voltar ao início
      </Link>
    </div>
  );
}
