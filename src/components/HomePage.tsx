import CategoryList from './CategoryList.tsx';
import SubcategoryList from './SubcategoryList.tsx';
import { useSearchParams } from 'react-router-dom';
import EventList from './EventList.tsx';
import { Text } from '@chakra-ui/react';

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
                <section>
                <CategoryList onCategoryClick={handleCategoryClick} />
                {category ? (
                    <SubcategoryList
                        category={category}
                        onSubcategoryClick={handleSubcategoryClick}
                    />
                ) : (
                    <Text color="fg.muted" mt={6} mb={2} >Displaying events from all categories</Text>
                )}
                </section>
                <EventList/>
            </>
    );
};

export default HomePage;