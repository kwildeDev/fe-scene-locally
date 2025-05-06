import CategoryList from './CategoryList.tsx';
import SubcategoryList from './SubcategoryList.tsx';
import { useSearchParams } from 'react-router-dom';
import EventList from './EventList.tsx';

const HomePage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const category = searchParams.get("category");

    const handleCategoryClick = (categorySlug: string) => {
        if (categorySlug === "") {
            setSearchParams("");
        } else {
            setSearchParams({ category: categorySlug });
        }
    };

    const handleSubcategoryClick = (subcategorySlug: string) => {
        if (category) {
            setSearchParams({ category, subcategory: subcategorySlug });
        }
    };

    
    return (
            <>
                <CategoryList onCategoryClick={handleCategoryClick} />
                {category && (
                    <SubcategoryList
                        category={category}
                        onSubcategoryClick={handleSubcategoryClick}
                    />
                )}
                <EventList/>
            </>
    );
};

export default HomePage;