import { Link } from 'react-router-dom'
import { useCart } from '../store/cart.js'
import { formatPrice } from '../data/products.js'

export default function ProductCard({ product }) {
  const add = useCart((s) => s.add)

  return (
    <article className="pcard reveal">
      <Link to={`/product/${product.slug}`} className="pcard__media">
        <img src={product.img} alt={product.name} loading="lazy" />
        <button
          className="pcard__add"
          onClick={(e) => {
            e.preventDefault()
            add(product)
          }}
        >
          Add to bag — {formatPrice(product.price)}
        </button>
      </Link>
      <div className="pcard__body">
        <div className="pcard__cat">
          {product.type}
          {product.size ? ` · ${product.size}` : ''}
        </div>
        <Link to={`/product/${product.slug}`}>
          <h3 className="pcard__name">{product.name}</h3>
        </Link>
        <div className="pcard__price">{formatPrice(product.price)}</div>
      </div>
    </article>
  )
}
